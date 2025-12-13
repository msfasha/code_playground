#!/bin/bash

# Script to check application accessibility

echo "=== Application Access Check ==="
echo ""

# Check if services are running
echo "1. Checking Docker containers..."
docker compose -f docker-compose.prod.yml ps | grep -E "(nginx|backend|frontend)" | head -5
echo ""

# Check local access
echo "2. Testing local access (localhost)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost/health | grep -q "200"; then
    echo "✓ Localhost access: OK"
else
    echo "✗ Localhost access: FAILED"
fi
echo ""

# Get local IP
LOCAL_IP=$(ip addr show | grep -E "inet.*192\.168\." | head -1 | awk '{print $2}' | cut -d'/' -f1)
if [ -n "$LOCAL_IP" ]; then
    echo "3. Testing local network access ($LOCAL_IP)..."
    if curl -s -o /dev/null -w "%{http_code}" http://$LOCAL_IP/health | grep -q "200"; then
        echo "✓ Local network access ($LOCAL_IP): OK"
        echo "  You can access the app at: http://$LOCAL_IP"
    else
        echo "✗ Local network access ($LOCAL_IP): FAILED"
    fi
    echo ""
fi

# Check public IP access
PUBLIC_IP="46.32.109.46"
echo "4. Testing public IP access ($PUBLIC_IP)..."
if timeout 3 curl -s -o /dev/null -w "%{http_code}" http://$PUBLIC_IP/health 2>/dev/null | grep -q "200"; then
    echo "✓ Public IP access ($PUBLIC_IP): OK"
    echo "  You can access the app at: http://$PUBLIC_IP"
elif timeout 3 curl -s http://$PUBLIC_IP/health 2>&1 | grep -q "Connection refused\|timeout\|No route"; then
    echo "✗ Public IP access ($PUBLIC_IP): Connection refused or timeout"
    echo "  This usually means:"
    echo "  - Firewall is blocking port 80"
    echo "  - Port forwarding is not configured"
    echo "  - The IP is not routed to this machine"
else
    echo "? Public IP access ($PUBLIC_IP): Unknown error"
fi
echo ""

# Check firewall
echo "5. Firewall status (requires sudo)..."
if command -v ufw >/dev/null 2>&1; then
    echo "UFW status:"
    sudo ufw status 2>/dev/null || echo "  (Cannot check - needs sudo password)"
elif command -v firewall-cmd >/dev/null 2>&1; then
    echo "Firewalld status:"
    sudo firewall-cmd --list-all 2>/dev/null || echo "  (Cannot check - needs sudo password)"
else
    echo "  No common firewall tool found (check iptables manually)"
fi
echo ""

echo "=== Access Instructions ==="
echo ""
if [ -n "$LOCAL_IP" ]; then
    echo "From the same network, try:"
    echo "  http://$LOCAL_IP"
    echo ""
fi
echo "From outside the network, you need:"
echo "  1. Firewall rules allowing port 80 and 443"
echo "  2. Port forwarding configured (if behind NAT/router)"
echo "  3. Access via: http://46.32.109.46"
echo ""
echo "To open firewall ports (if using UFW):"
echo "  sudo ufw allow 80/tcp"
echo "  sudo ufw allow 443/tcp"
echo ""

