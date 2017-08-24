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

![](http://mpastell.com/images/language-weave.png)

## Run code using Hydrogen

[Hydrogen](https://github.com/nteract/hydrogen) supports running code from Pweave and Weave code chunks using
its [rich multi language document](https://blog.nteract.io/hydrogen-introducing-rich-multi-language-documents-b5057ff34efc)
-feature. You simply need to install Hydrogen and you can use hydrogen keybindings to run code e.g `ctrl-enter` to run a line and `ctrl-alt-enter` to run entire chunk.

## Run Julia code using Juno

If you have installed [Juno](http://junolab.org/), running code from Weave.jl documents works using `ctrl-enter` and `shift-enter` keybindings. Using Juno disables these keybindings for Hydrogen.
