#!/bin/sh
SCRIPTS_DIR=$(cd $(dirname $0); pwd)
BASE_DIR=$(cd $(dirname $SCRIPTS_DIR); pwd)

PLUGIN_NAME=${BASE_DIR##*/}
DIST_DIR=$BASE_DIR/dist
CONTENTS_DIR=$DIST_DIR/contents
MANIFEST_FILE=$CONTENTS_DIR/manifest.json
PACKAGE_DIR=$DIST_DIR/package
PPK_FILE=$DIST_DIR/${PLUGIN_NAME}.ppk
OUTPUT_FILE=$DIST_DIR/$PLUGIN_NAME.zip

# Command
which sed >/dev/null 2>&1
if [ $? -ne 0 ] ; then
  echo "missing sed."
  exit 1
fi

# Create package directory
mkdir $PACKAGE_DIR >/dev/null 2>&1

# And creating a content file by compressing the plug Directory
CONTENTS_FILE=$PACKAGE_DIR/contents.zip
cd $CONTENTS_DIR
zip -r $CONTENTS_FILE ./ >/dev/null

# Create secret key
TMP_PPK_FILE=$DIST_DIR/tmp.ppk
if [ ! -f "$PPK_FILE" ] ; then
  openssl genrsa -out $TMP_PPK_FILE 1024 >/dev/null 2>&1
else
  cp $PPK_FILE $TMP_PPK_FILE
fi

# Create a signature and public key
PUB_FILE=$PACKAGE_DIR/PUBKEY
SIG_FILE=$PACKAGE_DIR/SIGNATURE
openssl sha1 -sha1 -binary -sign $TMP_PPK_FILE < $CONTENTS_FILE > $SIG_FILE
openssl rsa -pubout -outform DER < $TMP_PPK_FILE > $PUB_FILE 2>/dev/null

UUID=`openssl dgst -sha256 < $PUB_FILE | sed 's/^.* //' | cut -c 1-32 | tr '0-9a-f' 'a-p'`
if [ ! -f "$PPK_FILE" ] ; then
  echo "Private key file created, UUID=$UUID"
else
  echo "Private key file updated, UUID=$UUID"
fi
mv $TMP_PPK_FILE $PPK_FILE

cd $PACKAGE_DIR
zip -r $OUTPUT_FILE ./ >/dev/null

echo "Plugin file: $(basename $OUTPUT_FILE)"
