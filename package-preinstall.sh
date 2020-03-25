# checks for the required version of cypress and offers to install it
if [ `npm list -g | grep -c cypress@$GLOBAL_CYPRESS_VERSION_DEPENDENCY` -eq 0 ]
then
  echo "This project requires cypress@$GLOBAL_CYPRESS_VERSION_DEPENDENCY installed globally."
  read -p "Would you like to install it globally now? " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    npm install -g cypress@$GLOBAL_CYPRESS_VERSION_DEPENDENCY
  fi
else
  echo "cypress already installed globally"
fi
