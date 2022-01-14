angular
  .module("General")
  .value("Languages", {
    c: "C",
    cpp: "C++",
    cpp11: "C++11",
    java: "Java",
    "python2.7": "Python 2.7",
    python3: "Python 3",
  })
  .value("TextEditorLanguageMode", {
    c: "text/x-csrc",
    cpp: "text/x-c++src",
    cpp11: "text/x-c++src",
    java: "text/x-java",
    "python2.7": "text/x-python",
    python3: "text/x-python",
    "": "",
  })
  .value("OJName", {
    beecrowd: "Beecrowd",
    cf: "Codeforces",
    cfgroups: "Codeforces Groups",
    cfgym: "Codeforces Gym",
    codechef: "CodeChef",
    kattis: "Kattis",
    la: "LiveArchive",
    oj: "OnlineJudge",
    poj: "POJ",
    spoj: "Spoj",
    spojbr: "SpojBR",
    timus: "Timus",
  })
  .value("Verdict", {
    "-4": {
      text: "Compiling...",
      class: "white-submission",
    },
    "-3": {
      text: "Running...",
      class: "white-submission",
    },
    "-2": {
      text: "Compiling...",
      class: "white-submission",
    },
    "-1": {
      text: "Sent to judger...",
      class: "white-submission",
    },
    0: {
      text: "Pending",
      class: "white-submission",
    },
    1: {
      text: "Accepted",
      class: "green-submission",
      notification: "success",
    },
    2: {
      text: "Wrong Answer",
      class: "red-submission",
      notification: "error",
    },
    3: {
      text: "Time Limit Exceeded",
      class: "blue-submission",
      notification: "info",
    },
    4: {
      text: "Compile Error",
      class: "blue-submission",
      notification: "info",
    },
    5: {
      text: "Runtime Error",
      class: "blue-submission",
      notification: "info",
    },
    6: {
      text: "Memory Limit Error",
      class: "blue-submission",
      notification: "info",
    },
    7: {
      text: "Output Limit Error",
      class: "blue-submission",
      notification: "info",
    },
    8: {
      text: "Formatting Error",
      class: "yellow-submission",
      notification: "warning",
    },
    9: {
      text: "Unknown Error",
      class: "grey-submission",
      notification: "info",
    },
    10: {
      text: "Restricted function use",
      class: "blue-submission",
      notification: "info",
    },
    11: {
      text: "Internal Error",
      class: "grey-submission",
      notification: "info",
    },
    12: {
      text: "Submission Error",
      class: "grey-submission",
      notification: "info",
    },
    15: {
      text: "Draft",
      class: "grey-submission",
    },
  });
