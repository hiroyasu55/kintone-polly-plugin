# kintone-polly-plugin
kintone読み上げプラグイン

==========================

## Requirement

* A bash shell
* zip and openssl libraries are required on Windows using Cygwin
* **For Mac users only**: No dotfiles (such as .DS_Store) in any of the folders inside your plugin. To automatically remove all instances of .DS_Store in your plugin folders, run the following Terminal command in the plugin directory:
```find . -name ".DS_Store" -delete```
(Note that .DS_Store files are only used by the Finder to hold custom view settings for that particular folder. In most cases nothing will happen if you delete them, or at worst custom Finder view settings (icon size, position, background color, etc) will be lost.)

## How to Use

```bash
$ package.sh <plug-in dir> [<key file>]
```
## Output Files

### Plug-in Package
```bash
plugins/<plug-in id>/plugin.zip
```

### Private Key
```bash
keys/<plug-in dir>.<plug-in id>.ppk
```
**Do not lose the private key!** Keep the .ppk file secret and in a safe place. You'll need it later if you want to update the plug-in.

## Example
```bash
$ cd work_dir
$ git clone https://github.com/logicheart/kintone-polly-plugin
$ bash package.sh
```

## Install Plug-in

## Licence

MIT License

## Copyright

Copyright(c) LogicHeart
