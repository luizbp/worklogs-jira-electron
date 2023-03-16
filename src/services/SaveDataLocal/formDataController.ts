import { Option } from '../../types/Option'
import { FormData } from '../../types/FormData'

export const formDataController = (type: FormData) => {

  const get = () => {
    const data = localStorage.getItem(type);

    return data ? JSON.parse(data) : []
  };

  const save = (newItem: Option) => {
    const currentData = localStorage.getItem(type);
    const options: Option[] = currentData ? JSON.parse(currentData) : [];

    options.push(newItem);
    localStorage.setItem(type, JSON.stringify(options));
  };

  const clear = () => {
    localStorage.setItem(type, JSON.stringify([]));
  };


  return {
    get,
    save,
    clear
  }
}