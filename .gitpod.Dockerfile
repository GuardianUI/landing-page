FROM gitpod/workspace-full:latest

RUN bash -c 'VERSION="--lts" \
    && source $HOME/.nvm/nvm.sh && nvm install $VERSION \
    && nvm use $VERSION \
    && npx playwright install && npx playwright install-deps chromium'

RUN echo "nvm use $VERSION &>/dev/null" >> ~/.bashrc.d/51-nvm-fix
