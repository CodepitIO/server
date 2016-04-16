{
  "targets": [
    {
      "target_name": "pindexer",
      "sources": [ "pindexer.cpp", "partialname.h", "problem.h" ],
      "include_dirs": [ "<!(node -e \"require('nan')\")" ]
    }
  ]
}
