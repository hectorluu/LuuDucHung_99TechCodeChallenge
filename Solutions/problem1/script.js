// Calculates the sum of all integers from 1 to n using mathematical formula.
var sum_to_n_a = function (n) {
  if (n < 0) {
    return (n * (n - 1)) / 2;
  } else {
    return (n * (n + 1)) / 2;
  }
};

// Calculates the sum of all integers from 1 to n using a loop.
var sum_to_n_b = function (n) {
  let answer = 0;
  if (n < 0) {
    for (let i = n; i <= -1; i++) {
      answer += i;
    }
  } else {
    for (let i = 1; i <= n; i++) {
      answer += i;
    }
  }

  return answer;
};

// Calculates the sum of all integers from 1 to n using recursion.
var sum_to_n_c = function (n) {
  if (n === 0) {
    return 0;
  } else if (n < 0) {
    return n + sum_to_n_c(n + 1);
  } else {
    return n + sum_to_n_c(n - 1);
  }
};
