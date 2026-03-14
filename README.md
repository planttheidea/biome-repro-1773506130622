# Biome issue 9483 reproduction

This repo is meant to have a simple reproduction of [issue 9483](https://github.com/biomejs/biome/issues/9483), since the playground was insufficient.

## Repro steps

Run the `lint` script to see the panic. If you comment out the first two `constructor()` signatures to leave the final one only, the `lint` script will now pass.