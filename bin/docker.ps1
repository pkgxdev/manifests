$SRCROOT = Resolve-Path (Join-Path $PSScriptRoot "..")
$img = "ghcr.io/pkgxdev/bldbot"
$cmd = $args[0]
$remainingArgs = $args[1..($args.Length - 1)]

if ($remainingArgs.Length -eq 1) {
    switch ($cmd) {
        "run" {
            & docker run `
                --rm `
                --volume "$SRCROOT`:/work" `
                -w "/work" `
                -e GITHUB_TOKEN `
                -e PATH="/work/bin:/usr/local/bin:/usr/bin:/usr/sbin:/bin:/sbin" `
                -it `
                "$img"
            exit $LASTEXITCODE
        }
        "pull" {
            & docker pull "$img"
            exit $LASTEXITCODE
        }
    }
}

& docker $cmd @remainingArgs
exit $LASTEXITCODE
