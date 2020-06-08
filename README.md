# How to use the cli

## Purpose
Chimp cli will make your life easier to edit your chimp recipes
This cli will allow you to use your own IDE to edit your recipe.
It will also allow you use others tools (sass / js bundle and so on)
It includes a live reload tool

## Requirements

- having a chimp.fr active acccount
- having an existing recipe (even with empty JS / CSS)

## How to use it ?

checkout and install globally
```
git clone https://github.com/Sunny-fr/toolbox.git && npm i -g
```

## Command
now you have a global command called chimp, go to your workspace/project folder
and run the command *chimp*

```
chimp
```

![](docs-assets/chimp-watch.gif)


## Demo

![](docs-assets/chimp-demo.gif)


# suggestions

use rollup or some bundler tool and set the target files to your chimp project files



# what's going on behind ? 
a file called .chimp-config will be created with you project params included inside


