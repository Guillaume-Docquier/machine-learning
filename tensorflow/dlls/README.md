So it's hard to build tfjs-node bindings on windows. I can't remember how I did it the first time, but this tensorflow.dll is missing when you install tfjs and try to build it.

Add it to "\node_modules\@tensorflow\tfjs-node\lib\napi-v4" and everything should work.