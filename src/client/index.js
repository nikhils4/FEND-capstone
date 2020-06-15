import {validateAndProcess} from './js/formHandler';
import {updateUI} from './js/formHandler';
import 'bootstrap';
import './styles/main.scss';

document.getElementById('form-submit').addEventListener('click', validateAndProcess)

export { validateAndProcess };