# Atom support Weave.jl and Pweave

Atom syntax highlighting for [Weave.jl](http://weavejl.mpastell.com) and
[Pweave](http://mpastell.com/pweave) documents.

Provides the following modes:
  - `Weave.jl: markdown` for .jmd, .mdw and .jmdw (markdown with noweb)
  - `Weave.jl: LaTex` for  texw, .jtexw and .jnw.
  - `Weave.jl: reStructuredText` for .jrstw
  - `Pweave: markdown` for .pmd and .pmdw (markdown with noweb)
  - `Pweave: LaTex` for .ptexw and .pnw
  - `Pweave: reStructuredText` for .prstw and .rstw

If you need support for other formats open as issue or make a pull request.

![Juno integration image](https://user-images.githubusercontent.com/40514306/76081328-32f41900-5fec-11ea-958a-375f77f642a2.png)

## Run code using Hydrogen

[Hydrogen](https://github.com/nteract/hydrogen) supports running code from Pweave and Weave code chunks using
its [rich multi language document](https://blog.nteract.io/hydrogen-introducing-rich-multi-language-documents-b5057ff34efc)
-feature. 

For Python you simply need to install Hydrogen and you can use hydrogen keybindings to run code e.g `ctrl-enter` to run a line and `ctrl-alt-enter` to run entire chunk. 

For Julia you need to add the following to `.atom/keymap.cson` if you want to use Hydrogen instead of Juno:

```coffee
'.platform-linux .item-views > atom-text-editor[data-grammar="source weave md"],
.platform-linux .item-views > atom-text-editor[data-grammar="source weave latex"],
.platform-win32 .item-views > atom-text-editor[data-grammar="source weave md"],
.platform-win32 .item-views > atom-text-editor[data-grammar="source weave latex"]':
    'ctrl-enter': 'hydrogen:run'
    'shift-enter': 'hydrogen:run-and-move-down'

'.platform-darwin .item-views > atom-text-editor[data-grammar="source weave md"],
.platform-darwin .item-views > atom-text-editor[data-grammar="source weave latex"]':
    'cmd-enter': 'hydrogen:run'
    'shift-enter': 'hydrogen:run-and-move-down'
```


## Run Julia code using Juno

If you have installed [Juno](http://junolab.org/), running code from Weave.jl documents works using `ctrl-enter` and `shift-enter` keybindings.
