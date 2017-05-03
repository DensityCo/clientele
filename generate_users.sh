#!/bin/bash
# vim: set autoindent noexpandtab tabstop=4 shiftwidth=4 syntax=sh :

echo "* Nuking old users..."
rm -rf users/
mkdir -p users/

# Required because of: https://apple.stackexchange.com/questions/142860/install-shuf-on-os-x
echo "* Finding sort..."
SORT="$(which gsort)"
if [ -z "$SORT" ]; then
	SORT="$(which sort)"
fi

echo "* Generating users..."
for i in {0..100}; do
	USER="$(curl --silent https://randomuser.me/api/)"
	FULL_NAME="$(echo $USER | jq -r .results[0].name.first) $(echo $USER | jq -r .results[].name.last)"
	COLOR="$($SORT -R COLORS | head -1)"

	echo "* $FULL_NAME"

	cat <<-EOF > users/$i
	{
		"id": $i,
		"name": "$FULL_NAME",
		"color": "$COLOR",
		"email": $(echo $USER | jq .results[0].email),
		"picture": $(echo $USER | jq .results[0].picture.thumbnail)
	}
	EOF
done
