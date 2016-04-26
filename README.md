
# Atom support Weave.jl and Pweave

Atom syntax highlighting for [Weave.jl](http://weavejl.mpastell.com) and
[Pweave](http://mpastell.com/pweave) documents.

Provides the following modes:
  - `Weave.jl: markdown` for .jmd, .mdw and .jmdw (markdown with noweb)
  - `Weave.jl: LaTex` for  texw, .jtexw and .jnw.
  - `Pweave: markdown` for .pmd and .pmdw (markdown with noweb)
  - `Pweave: LaTex` for .ptexw and .pnw

If you need support for other formats open as issue or make a pull request.

![](http://mpastell.com/images/language-weave.png)

## Run code from Atom

You can also run the code from chunks directly in Atom while developing using
[Hydrogen](https://atom.io/packages/Hydrogen) after you set the correct kernel for
each is document type under: **Language mappings** e.g:

```javascript
{ "julia" : "weave.jl markdown", "python": "pweave markdown" }
```
