#!/usr/bin/env python3
"""
Performance Test Script for Jordan Universities Rating System
"""

import requests
import time
import statistics
from datetime import datetime

def test_endpoint(url, name, iterations=5):
    """Test an endpoint and return performance metrics"""
    times = []
    errors = 0
    
    print(f"Testing {name} ({url})...")
    
    for i in range(iterations):
        try:
            start_time = time.time()
            response = requests.get(url, timeout=10)
            end_time = time.time()
            
            if response.status_code == 200:
                times.append(end_time - start_time)
                print(f"  Request {i+1}: {times[-1]:.3f}s")
            else:
                errors += 1
                print(f"  Request {i+1}: Error {response.status_code}")
                
        except Exception as e:
            errors += 1
            print(f"  Request {i+1}: Exception - {e}")
        
        time.sleep(0.5)  # Small delay between requests
    
    if times:
        avg_time = statistics.mean(times)
        min_time = min(times)
        max_time = max(times)
        
        print(f"  Results: Avg={avg_time:.3f}s, Min={min_time:.3f}s, Max={max_time:.3f}s")
        return {
            'name': name,
            'url': url,
            'avg_time': avg_time,
            'min_time': min_time,
            'max_time': max_time,
            'errors': errors,
            'success_rate': (len(times) / iterations) * 100
        }
    else:
        print(f"  Results: All requests failed")
        return {
            'name': name,
            'url': url,
            'avg_time': 0,
            'min_time': 0,
            'max_time': 0,
            'errors': errors,
            'success_rate': 0
        }

def main():
    """Main performance test function"""
    base_url = "http://localhost:5001"
    
    print("=" * 60)
    print("🎓 JORDAN UNIVERSITIES RATING SYSTEM - PERFORMANCE TEST")
    print("=" * 60)
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Base URL: {base_url}")
    print()
    
    endpoints = [
        ("/", "Home Page"),
        ("/api/universities", "Universities API"),
        ("/register", "Registration Page"),
        ("/login", "Login Page"),
    ]
    
    results = []
    
    for endpoint, name in endpoints:
        url = base_url + endpoint
        result = test_endpoint(url, name)
        results.append(result)
        print()
    
    # Summary
    print("=" * 60)
    print("📊 PERFORMANCE SUMMARY")
    print("=" * 60)
    
    for result in results:
        status = "✅" if result['success_rate'] == 100 else "⚠️"
        print(f"{status} {result['name']:<20} | Avg: {result['avg_time']:.3f}s | Success: {result['success_rate']:.0f}%")
    
    # Overall performance
    successful_results = [r for r in results if r['success_rate'] > 0]
    if successful_results:
        avg_response_time = statistics.mean([r['avg_time'] for r in successful_results])
        print(f"\n🏆 Overall Average Response Time: {avg_response_time:.3f}s")
        
        if avg_response_time < 0.1:
            print("🎉 Excellent performance!")
        elif avg_response_time < 0.5:
            print("👍 Good performance")
        elif avg_response_time < 1.0:
            print("⚠️  Moderate performance - consider optimizations")
        else:
            print("🚨 Poor performance - needs optimization")
    
    print(f"\nTest completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main() 