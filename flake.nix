{
  description = "padigitale2026-opendata";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = {
    flake-utils,
    nixpkgs,
    self,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
      in {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.deno
            (pkgs.python3.withPackages (python-pkgs: [
              python-pkgs.numpy
              python-pkgs.pandas
              python-pkgs.requests
            ]))
          ];
        };
        formatter = pkgs.alejandra;
      }
    );
}
