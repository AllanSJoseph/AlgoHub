# Sample Problem Data to Test

These are some sample problems data to add and test on AlgoHub. These include all the fields on the Create and Upload Pages. This data contains 5 Sample Problems to test.

# How to use
1. Log In to AlgoHub as Admin User. (In MongoDB you need to import the Admin user collection, credentials are )
2. Click on Admin section from the Navigation
3. Click Create Problem
4. Copy Paste the below fields as given below.



# Q.1

## Title:

```
Count Odd and Even
```

## Description:
```
Given an integer array of size ‘n’, count the number of odd and even elements present in the array.
```
## Difficulty: ```Easy```

## Tags: ```Array```

## Test Cases:
### Visible:

### Input:
```plaintext
5
2 3 4 5 6
```

### Output:
```plaintext
2 3
```

### Explanation:
```plaintext
The odd numbers in the array are 3 and 5 (count = 2). The even numbers are 2, 4, and 6 (count = 3).
```

### Hidden:

### Input: 
```plaintext
1
0
```

### Output:
```plaintext
0 1
```

## Code Templates:

### C++
#### Initial Code:
```cpp
#include <iostream>
#include <vector>

using namespace std; 

// VISIBLE_CODE_START
pair<int, int> countOddEven(int n, const vector<long long>& arr) {
    // Write your code here
}
// VISIBLE_CODE_END

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (!(cin >> n)) return 0;
    vector<long long> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    pair<int, int> result = countOddEven(n, arr);
    cout << result.first << " " << result.second << endl;
    return 0;
}
```

#### Reference Solution:
```cpp
#include <iostream>
#include <vector>

using namespace std; 

// VISIBLE_CODE_START
pair<int, int> countOddEven(int n, const vector<long long>& arr) {
    int odd = 0, even = 0;
    for(int i = 0; i < n; i++) {
        if (arr[i] % 2 == 0) {
            even++;
        } else {
            odd++;
        }
    }
    return {odd, even};
}
// VISIBLE_CODE_END

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (!(cin >> n)) return 0;
    vector<long long> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    pair<int, int> result = countOddEven(n, arr);
    cout << result.first << " " << result.second << endl;
    return 0;
}
```

### Java
#### Initial Code:
```java
import java.util.*;
import java.io.*;

public class Main {
    // VISIBLE_CODE_START
    public static int[] countOddEven(int n, long[] arr) {
        // Return an array [oddCount, evenCount]
    }
    // VISIBLE_CODE_END

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line1 = br.readLine();
        if (line1 == null) return;
        int n = Integer.parseInt(line1.trim());
        long[] arr = new long[n];
        String line2 = br.readLine();
        if (line2 != null) {
            StringTokenizer st = new StringTokenizer(line2);
            for (int i = 0; i < n; i++) {
                arr[i] = Long.parseLong(st.nextToken());
            }
        }
        int[] result = countOddEven(n, arr);
        System.out.println(result[0] + " " + result[1]);
    }
}
```

#### Reference Solution:
```java
import java.util.*;
import java.io.*;

public class Main {
    // VISIBLE_CODE_START
    public static int[] countOddEven(int n, long[] arr) {
        int odd = 0, even = 0;
        for (int i = 0; i < n; i++) {
            if (arr[i] % 2 == 0) {
                even++;
            } else {
                odd++;
            }
        }
        return new int[]{odd, even};
    }
    // VISIBLE_CODE_END

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line1 = br.readLine();
        if (line1 == null) return;
        int n = Integer.parseInt(line1.trim());
        long[] arr = new long[n];
        String line2 = br.readLine();
        if (line2 != null) {
            StringTokenizer st = new StringTokenizer(line2);
            for (int i = 0; i < n; i++) {
                arr[i] = Long.parseLong(st.nextToken());
            }
        }
        int[] result = countOddEven(n, arr);
        System.out.println(result[0] + " " + result[1]);
    }
}
```

### JavaScript:
#### Initial Code:
```javascript
const fs = require('fs');

// VISIBLE_CODE_START
function countOddEven(n, arr) {
    // Return an array [oddCount, evenCount]
}
// VISIBLE_CODE_END

function main() {
    const input = fs.readFileSync(0, 'utf8').split(/\s+/);
    if (input.length === 0 || input[0] === '') return;
    
    let idx = 0;
    const n = parseInt(input[idx++]);
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(BigInt(input[idx++]));
    }

    const [odd, even] = countOddEven(n, arr);
    console.log(`${odd} ${even}`);
}

main();
```

#### Reference Solution:
```javascript
const fs = require('fs');

// VISIBLE_CODE_START
function countOddEven(n, arr) {
    let odd = 0, even = 0;
    for (let i = 0; i < n; i++) {
        if (arr[i] % 2n === 0n) {
            even++;
        } else {
            odd++;
        }
    }
    return [odd, even];
}
// VISIBLE_CODE_END

function main() {
    const input = fs.readFileSync(0, 'utf8').split(/\s+/);
    if (input.length === 0 || input[0] === '') return;
    
    let idx = 0;
    const n = parseInt(input[idx++]);
    const arr = [];
    for (let i = 0; i < n; i++) {
        if (input[idx] !== undefined) {
            arr.push(BigInt(input[idx++]));
        }
    }

    const [odd, even] = countOddEven(n, arr);
    process.stdout.write(odd + " " + even + "\n");
}

main();
```

### Python:
#### Initial Code:
```python
import sys

# VISIBLE_CODE_START
def count_odd_even(n, arr):
    # Return a tuple (odd_count, even_count)
# VISIBLE_CODE_END

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    arr = list(map(int, input_data[1:]))
    odd_c, even_c = count_odd_even(n, arr)
    print(f"{odd_c} {even_c}")

if __name__ == "__main__":
    main()
```

#### Refernce Solution:
```python
import sys

# VISIBLE_CODE_START
def count_odd_even(n, arr):
    odd = 0
    even = 0
    for x in arr:
        if x % 2 == 0:
            even += 1
        else:
            odd += 1
    return (odd, even)
# VISIBLE_CODE_END

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    arr = list(map(int, input_data[1:]))
    odd_c, even_c = count_odd_even(n, arr)
    print(f"{odd_c} {even_c}")

if __name__ == "__main__":
    main()
```

---

# Q.2

## Title:

```
Program for average of array
```

## Description:
```
Given an array, the task is to find average of that array. Average is the sum of array elements divided by the number of elements.
```
## Difficulty: ```Easy```

## Tags: ```Array```, ```Math```

## Test Cases:
### Visible:

### Input:
```plaintext
5
1 2 3 4 5
```

### Output:
```plaintext
3
```

### Explanation:
```plaintext
Sum of the elements is 1+2+3+4+5 = 15 and total number of elements is 5. So average is 15/5 = 3
```

### Hidden:

### Input: 
```plaintext
5
5 3 6 7 5 3
```

### Output:
```plaintext
4.83333
```

## Code Templates:

### C++
#### Initial Code:
```cpp
#include <iostream>
#include <vector>
using namespace std;

// VISIBLE_CODE_START
double findAverage(vector<int>& arr, int n) {
    // Write your logic here
}
// VISIBLE_CODE_END

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    cout << findAverage(arr, n) << endl;
    return 0;
}
```

#### Reference Solution:
```cpp
#include <iostream>
#include <vector>
using namespace std;

// VISIBLE_CODE_START
double findAverage(vector<int>& arr, int n) {
    long long sum = 0;
    for (int x : arr) {
        sum += x;
    }
    return (double)sum / n;
}
// VISIBLE_CODE_END

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    cout << findAverage(arr, n) << endl;
    return 0;
}
```

### Java
#### Initial Code:
```java
import java.util.*;
import java.io.*;

public class Main {
    // VISIBLE_CODE_START
    public static double findAverage(int[] arr, int n) {
       // Write your logic here
    }
    // VISIBLE_CODE_END

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        int n = Integer.parseInt(line.trim());
        int[] arr = new int[n];
        StringTokenizer st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) {
            arr[i] = Integer.parseInt(st.nextToken());
        }
        double result = findAverage(arr, n);
        if (result == (long) result) {
            System.out.println((long) result);
        } else {
            System.out.println(result);
        }
    }
}
```

#### Reference Solution:
```java
import java.util.*;
import java.io.*;

public class Main {
    // VISIBLE_CODE_START
    public static double findAverage(int[] arr, int n) {
        long sum = 0;
        for (int x : arr) {
            sum += x;
        }
        return (double) sum / n;
    }
    // VISIBLE_CODE_END

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        int n = Integer.parseInt(line.trim());
        int[] arr = new int[n];
        StringTokenizer st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) {
            arr[i] = Integer.parseInt(st.nextToken());
        }
        double result = findAverage(arr, n);
        if (result == (long) result) {
            System.out.println((long) result);
        } else {
            System.out.println(result);
        }
    }
}
```

### JavaScript:
#### Initial Code:
```javascript
const fs = require('fs');

// VISIBLE_CODE_START
function findAverage(arr, n) {
    // Write your logic here
}
// VISIBLE_CODE_END

function main() {
    const input = fs.readFileSync(0, 'utf8').split(/\s+/);
    if (input.length < 1) return;
    let idx = 0;
    const n = parseInt(input[idx++]);
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(parseInt(input[idx++]));
    }
    const result = findAverage(arr, n);
    console.log(result);
}

main();
```

#### Reference Solution:
```javascript
const fs = require('fs');

// VISIBLE_CODE_START
function findAverage(arr, n) {
    if (n === 0) return 0;
    const sum = arr.reduce((acc, curr) => acc + curr, 0);
    return sum / n;
}
// VISIBLE_CODE_END

function main() {
    const input = fs.readFileSync(0, 'utf8').split(/\s+/);
    if (input.length < 1) return;
    let idx = 0;
    const n = parseInt(input[idx++]);
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(parseInt(input[idx++]));
    }
    const result = findAverage(arr, n);
    console.log(result);
}

main();
```

### Python:
#### Initial Code:
```python
import sys

# VISIBLE_CODE_START
def find_average(arr, n):
    // Write your logic here
# VISIBLE_CODE_END

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    result = find_average(arr, n)
    if result == int(result):
        print(int(result))
    else:
        print(result)

if __name__ == "__main__":
    main()
```

#### Refernce Solution:
```python
import sys

# VISIBLE_CODE_START
def find_average(arr, n):
    if n == 0: return 0
    return sum(arr) / n
# VISIBLE_CODE_END

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    result = find_average(arr, n)
    if result == int(result):
        print(int(result))
    else:
        print(result)

if __name__ == "__main__":
    main()
```

# Q.3

## Title:

```
Check if a number is Palindrome
```

## Description:
```
Given an integer n, determine whether it is a palindrome number or not. A number is called a palindrome if it reads the same from forward and backward.
```
## Difficulty: ```Easy```

## Tags: ```Math```

## Test Cases:
### Visible:

### Input:
```plaintext
12321
```

### Output:
```plaintext
true
```

### Explanation:
```plaintext
12321 is a palindrome number because it reads same  forward and backward.
```

### Hidden:

### Input: 
```plaintext
1234
```

### Output:
```plaintext
false
```

## Code Templates:

### C++
#### Initial Code:
```cpp
#include <iostream>

using namespace std;

// VISIBLE_CODE_START
bool isPalindrome(int n) {
    // Write your code here
}
// VISIBLE_CODE_END

int main() {
    int n;
    if (cin >> n) {
        cout << (isPalindrome(n) ? "true" : "false") << endl;
    }
    return 0;
}
```

#### Reference Solution:
```cpp
#include <iostream>

using namespace std;

// VISIBLE_CODE_START
bool isPalindrome(int n) {
    if (n < 0) return false;
    if (n == 0) return true;
    if (n % 10 == 0) return false;

    long long reversed = 0;
    int original = n;
    while (n > 0) {
        reversed = reversed * 10 + (n % 10);
        n /= 10;
    }
    return reversed == (long long)original;
}
// VISIBLE_CODE_END

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        cout << (isPalindrome(n) ? "true" : "false") << endl;
    }
    return 0;
}
```

### Java
#### Initial Code:
```java
import java.util.*;
import java.io.*;

public class Main {
    // VISIBLE_CODE_START
    public static boolean isPalindrome(int n) {
        // Write your code here
    }
    // VISIBLE_CODE_END

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String input = br.readLine();
        if (input != null && !input.isEmpty()) {
            int n = Integer.parseInt(input.trim());
            System.out.println(isPalindrome(n));
        }
    }
}
```

#### Reference Solution:
```java
import java.util.*;
import java.io.*;

public class Main {
    // VISIBLE_CODE_START
    public static boolean isPalindrome(int n) {
        if (n < 0) return false;
        if (n >= 0 && n < 10) return true;
        if (n % 10 == 0) return false;

        long reversed = 0;
        int temp = n;
        while (temp > 0) {
            reversed = reversed * 10 + (temp % 10);
            temp /= 10;
        }
        return reversed == (long) n;
    }
    // VISIBLE_CODE_END

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String input = br.readLine();
        if (input != null && !input.isEmpty()) {
            try {
                int n = Integer.parseInt(input.trim());
                System.out.println(isPalindrome(n));
            } catch (NumberFormatException e) {}
        }
    }
}
```

### JavaScript:
#### Initial Code:
```javascript
const fs = require('fs');

// VISIBLE_CODE_START
function isPalindrome(n) {
    // Write your code here
}
// VISIBLE_CODE_END

function main() {
    const input = fs.readFileSync(0, 'utf8').trim();
    if (input !== "") {
        const n = parseInt(input);
        console.log(isPalindrome(n));
    }
}

main();
```

#### Reference Solution:
```javascript
const fs = require('fs');

// VISIBLE_CODE_START
function isPalindrome(n) {
    if (n < 0) return false;
    const str = n.toString();
    const reversedStr = str.split('').reverse().join('');
    return str === reversedStr;
}
// VISIBLE_CODE_END

function main() {
    const input = fs.readFileSync(0, 'utf8').trim();
    if (input !== "") {
        const n = parseInt(input);
        if (!isNaN(n)) {
            console.log(isPalindrome(n));
        }
    }
}

main();
```

### Python:
#### Initial Code:
```python
import sys

# VISIBLE_CODE_START
def is_palindrome(n: int) -> bool:
    # Write your code here
# VISIBLE_CODE_END

def main():
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        print(str(is_palindrome(n)).lower())

if __name__ == "__main__":
    main()
```

#### Refernce Solution:
```python
import sys

# VISIBLE_CODE_START
def is_palindrome(n: int) -> bool:
    if n < 0: return False
    s = str(n)
    return s == s[::-1]
# VISIBLE_CODE_END

def main():
    input_data = sys.stdin.read().split()
    if input_data:
        try:
            n = int(input_data[0])
            print(str(is_palindrome(n)).lower())
        except ValueError:
            pass

if __name__ == "__main__":
    main()
```

# Q.4

## Title:

```
Amstrong Number
```

## Description:
```
Given a number x, determine whether the given number is Armstrong's number or not. A positive integer of n digits is called an Armstrong number of order n (order is the number of digits) if

abcd... = pow(a,n) + pow(b,n) + pow(c,n) + pow(d,n) + ....

Here a, b, c and d are digits of input number abcd...
```
## Difficulty: ```Easy```

## Tags: ```Math```

## Test Cases:
### Visible:

### Input:
```plaintext
153
```

### Output:
```plaintext
true
```

### Explanation:
```plaintext
153 is an Armstrong number, 1*1*1 + 5*5*5 + 3*3*3 = 153
```

### Hidden:

### Input: 
```plaintext
9474
```

### Output:
```plaintext
false
```

## Code Templates:

### C++
#### Initial Code:
```cpp
#include <iostream>
#include <cmath>
#include <string>

using namespace std;

// VISIBLE_CODE_START
bool isArmstrong(int n) {
    // Write your code here
}
// VISIBLE_CODE_END

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        cout << (isArmstrong(n) ? "true" : "false") << endl;
    }
    return 0;
}
```

#### Reference Solution:
```cpp
#include <iostream>
#include <cmath>
#include <string>

using namespace std;

// VISIBLE_CODE_START
bool isArmstrong(int n) {
    if (n < 0) return false;
    string s = to_string(n);
    int k = s.length();
    long long sum = 0;
    int temp = n;
    while (temp > 0) {
        sum += pow(temp % 10, k);
        temp /= 10;
    }
    return sum == (long long)n;
}
// VISIBLE_CODE_END

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        cout << (isArmstrong(n) ? "true" : "false") << endl;
    }
    return 0;
}
```

### Java
#### Initial Code:
```java
import java.io.*;
import java.util.*;

public class Main {
    // VISIBLE_CODE_START
    public static boolean isArmstrong(int n) {
        // Write your code here
    }
    // VISIBLE_CODE_END

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            int n = Integer.parseInt(line.trim());
            System.out.println(isArmstrong(n));
        }
    }
}
```

#### Reference Solution:
```java
import java.io.*;
import java.util.*;

public class Main {
    // VISIBLE_CODE_START
    public static boolean isArmstrong(int n) {
        if (n < 0) return false;
        String s = String.valueOf(n);
        int k = s.length();
        long sum = 0;
        int temp = n;
        while (temp > 0) {
            sum += Math.pow(temp % 10, k);
            temp /= 10;
        }
        return sum == n;
    }
    // VISIBLE_CODE_END

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            try {
                int n = Integer.parseInt(line.trim());
                System.out.println(isArmstrong(n));
            } catch (NumberFormatException e) {}
        }
    }
}
```

### JavaScript:
#### Initial Code:
```javascript
const fs = require('fs');

// VISIBLE_CODE_START
function isArmstrong(n) {
    // Write your code here
}
// VISIBLE_CODE_END

function main() {
    const input = fs.readFileSync(0, 'utf8').trim();
    if (input) {
        const n = parseInt(input);
        console.log(isArmstrong(n));
    }
}
main();
```

#### Reference Solution:
```javascript
const fs = require('fs');

// VISIBLE_CODE_START
function isArmstrong(n) {
    if (n < 0) return false;
    const s = n.toString();
    const k = s.length;
    let sum = 0;
    let temp = n;
    while (temp > 0) {
        sum += Math.pow(temp % 10, k);
        temp = Math.floor(temp / 10);
    }
    return sum === n;
}
// VISIBLE_CODE_END

function main() {
    const input = fs.readFileSync(0, 'utf8').trim();
    if (input) {
        const n = parseInt(input);
        console.log(isArmstrong(n));
    }
}
main();
```

### Python:
#### Initial Code:
```python
import sys

# VISIBLE_CODE_START
def is_armstrong(n: int) -> bool:
    # Write your code here
    pass
# VISIBLE_CODE_END

def main():
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        print(str(is_armstrong(n)).lower())

if __name__ == "__main__":
    main()
```

#### Refernce Solution:
```python
import sys

# VISIBLE_CODE_START
def is_armstrong(n: int) -> bool:
    if n < 0: return False
    s = str(n)
    k = len(s)
    total = sum(int(digit)**k for digit in s)
    return total == n
# VISIBLE_CODE_END

def main():
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        print(str(is_armstrong(n)).lower())

if __name__ == "__main__":
    main()
```


# Q.5

## Title:

```
Factorial of A Number
```

## Description:
```
Given the non-negative integers n , compute the factorial of a given number.
Note: Factorial of n is defined as n * (n -1) * (n - 2) * ... * 1, for n = 0, factorial is 1.
```
## Difficulty: ```Easy```

## Tags: ```Math```

## Test Cases:
### Visible:

### Input:
```plaintext
5
```

### Output:
```plaintext
120
```

### Explanation:
```plaintext
5! = 5 * 4 * 3 * 2 * 1 = 120 of the elements is 1+2+3+4+5 = 15 and total number of elements is 5. So average is 15/5 = 3
```

### Hidden:

### Input: 
```plaintext
4
```

### Output:
```plaintext
24
```

## Code Templates:

### C++
#### Initial Code:
```cpp
#include <iostream>

using namespace std;

// VISIBLE_CODE_START
long long getFactorial(int n) {
    // Write your code here
}
// VISIBLE_CODE_END

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        cout << getFactorial(n) << endl;
    }
    return 0;
}
```

#### Reference Solution:
```cpp
#include <iostream>

using namespace std;

// VISIBLE_CODE_START
long long getFactorial(int n) {
    if (n == 0 || n == 1) return 1;
    long long res = 1;
    for (int i = 2; i <= n; i++) {
        res *= i;
    }
    return res;
}
// VISIBLE_CODE_END

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        cout << getFactorial(n) << endl;
    }
    return 0;
}
```

### Java
#### Initial Code:
```java
import java.util.*;
import java.io.*;

public class Main {
    // VISIBLE_CODE_START
    public static long getFactorial(int n) {
        // Write your code here
    }
    // VISIBLE_CODE_END

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            int n = Integer.parseInt(line.trim());
            System.out.println(getFactorial(n));
        }
    }
}
```

#### Reference Solution:
```java
import java.util.*;
import java.io.*;

public class Main {
    // VISIBLE_CODE_START
    public static long getFactorial(int n) {
        if (n == 0 || n == 1) return 1L;
        long res = 1;
        for (int i = 2; i <= n; i++) {
            res *= i;
        }
        return res;
    }
    // VISIBLE_CODE_END

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            try {
                int n = Integer.parseInt(line.trim());
                System.out.println(getFactorial(n));
            } catch (NumberFormatException e) {}
        }
    }
}
```

### JavaScript:
#### Initial Code:
```javascript
const fs = require('fs');

// VISIBLE_CODE_START
function getFactorial(n) {
    // Write your code here
}
// VISIBLE_CODE_END

function main() {
    const input = fs.readFileSync(0, 'utf8').trim();
    if (input !== "") {
        const n = parseInt(input);
        console.log(getFactorial(n).toString());
    }
}

main();

```

#### Reference Solution:
```javascript
const fs = require('fs');

// VISIBLE_CODE_START
function getFactorial(n) {
    if (n === 0 || n === 1) return BigInt(1);
    let res = BigInt(1);
    for (let i = 2; i <= n; i++) {
        res *= BigInt(i);
    }
    return res;
}
// VISIBLE_CODE_END

function main() {
    const input = fs.readFileSync(0, 'utf8').trim();
    if (input !== "") {
        const n = parseInt(input);
        console.log(getFactorial(n).toString());
    }
}

main();
```

### Python:
#### Initial Code:
```python
import sys

# VISIBLE_CODE_START
def get_factorial(n):
    # Write your code here
    pass
# VISIBLE_CODE_END

def main():
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        print(get_factorial(n))

if __name__ == "__main__":
    main()
```

#### Refernce Solution:
```python
import sys

# VISIBLE_CODE_START
def get_factorial(n):
    if n == 0 or n == 1:
        return 1
    res = 1
    for i in range(2, n + 1):
        res *= i
    return res
# VISIBLE_CODE_END

def main():
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        print(get_factorial(n))

if __name__ == "__main__":
    main()

```