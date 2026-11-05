---
title: "UVa 10721 — Bar Codes (via combinations with repetition)"
date: 2024-03-17
description: CPE 2023-12-12, problem 7. Instead of DP, turn it into a bounded combinations-with-repetition problem and solve it with inclusion–exclusion.
tags: [CPE, UVa, Combinatorics, C++]
---

> This was also problem 7 of the CPE exam on 2023-12-12.
>
> - 🔗 [Problem statement](https://cpe.cse.nsysu.edu.tw/cpe/file/attendance/problemPdf/10721.pdf)
> - 🔗 [My solution (combinations with repetition)](https://github.com/leemikepop/cpe/blob/master/CPE20231212/007_uva10721/main.cpp)

## ❓ Idea

> The standard solution uses dynamic programming, but this problem happens to map neatly onto a counting problem.
>
> 🔗 [DP reference](https://www.larrysprognotes.com/UVa-10721/)

BC(n, k, m) can be read as counting integer solutions with repetition:

```text
n : n balls
k : k boxes
m : each box holds at most m balls (and at least 1)
```

$$
\begin{cases}
  x_{1} + x_{2} + x_{3} + \dots + x_{k} = n\\
  1 \leq x_{i} \leq m
\end{cases}
$$

Shift the bounds by letting $y_i = x_i - 1$, i.e. put one ball in every box first so none is empty:

$$
\begin{cases}
  y_{1} + y_{2} + y_{3} + \dots + y_{k} = n-k\\
  0 \leq y_{i} \leq m-1
\end{cases}
$$

Now apply combinations with repetition:

$$
sol = \binom{n-k+k-1}{k-1} + \sum_{i=1}^{k}\left ( -1 \right )^{i}\binom{k}{i}\binom{n-k+k-1-im}{k-1}
$$

Simplified:

$$
sol = \binom{n-1}{k-1} + \sum_{i=1}^{k}\left ( -1 \right )^{i}\binom{k}{i}\binom{n-1-im}{k-1}
$$

- First term: distribute n−k balls into k boxes, empty boxes allowed.
- Second term: use inclusion–exclusion to subtract the cases that exceed the upper bound.

## 📎 Code (C++)

Multiply and divide alternately when computing the binomial to avoid overflow — and use `long long`, of course.

```cpp
#include <iostream>
#include <string>
#include <sstream>

using namespace std;

long long nCk(int N, int M) {
    long long ret = 1;
    for(int i = 1; i <= M; ++i) {
        ret *= (N - M + i) / i;
    }
    return ret;
}

int main(){
    clock_t start = clock();
    ostringstream oss;
    string line;
	int n, k, m;
	while(getline(cin, line)){
        if (line.empty()) break;
		stringstream ss(line);
		ss >> n >> k >> m;
		if(n > m*k){
			oss << 0 << endl;
			continue;
		}
		//Use combination with repetition
		/*
		n : balls
		k : boxes
		m : upper bound of each box
		We would like to find the number of integer solutions => x1 + x2 + ... + xk = n (1 <= xi <= m)

		First, allocate one ball to every box. Then, remaining n-k balls.
		The equation => y1 + y2 + ... + yk = n-k (0 <= yi <= m-k)
		sol = C(n-k + k-1,k-1) - C(k,1)C(n-k -m +k-1,k-1) + C(k,2)C(n-k -2*m +k-1,k-1) - ... (by principle of inclusion-exclusion)
		*/
		long long ret = nCk(n-1, k-1);
		for(int i = 1; n-k >= i*m; ++i){
			ret += (i%2==0 ? nCk(k,i)*nCk(n-i*m-1,k-1) : (-1)*nCk(k,i)*nCk(n-i*m-1,k-1));
		}
		oss << ret << endl;
	}
    cout << oss.str();
    clock_t end = clock();
    double duration = (double)(end - start) / (__clock_t)1000;
    cout << endl << "Exicution Time: " << duration << " ms" << endl;
    return 0;
}
```
