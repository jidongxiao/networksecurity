$TTL 86400
@    IN    SOA   ns.cnn.com. root.cnn.com. (
                      2023100801 ; Serial
                      3600       ; Refresh
                      1800       ; Retry
                      1209600    ; Expire
                      86400 )    ; Minimum TTL

@           IN    NS    ns.cnn.com.
ns          IN    A     10.0.2.5
us          IN    CNAME cnn-tls.map.fastly.net.
