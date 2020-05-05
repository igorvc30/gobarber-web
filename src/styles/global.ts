import { createGlobalStyle } from 'styled-components';
import githubBackground from '../assets/github-background.svg';

export default createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
}

body {
    -webkit-font-smoothing: antialiased;
    background: #312E38;
    color: #FFF;
}

body, input, button {
    font: 16px 'Roboto Slab', serif;
}

h1,h2,h3,h4,h5,h6, strong{
    font-weight: 500;
}

button {
    cursor: pointer;
}
`;