import React from 'react';
import MinValidation from '../../utils/validators/Min';
import RegexValidation from '../../utils/validators/Regex';
import Input from './Input';
import Dropdown from './Dropdown';


class ComponentFactory {


    static getComponent(key, element, path) {

        const getRefToPath = (obj, path) => {

            let split = path.split('.'),
                lastRef = obj;

            split.forEach(item => {
                lastRef = lastRef[item];
            });

            return lastRef;
        };

        let target = getRefToPath(this.state, path),
            lastRef = this.state.data;

        let splits = path.replace(/\.properties/g, '')
            .replace('schema.', '')
            .split('.');

        let name = splits.pop();
        splits.forEach((item) => {
            lastRef = lastRef[item] = lastRef[item] || {};
        });


        const onChange = (path)=> {


            let convert = (value) => {
                return value
            };

            if (target.type === 'number') {
                convert = (value) => {
                    return parseFloat(value)
                }
            }

            return (e) => {
                let ref = this.state.data;
                splits.forEach((item) => {
                    ref = ref[item]
                });
                ref[name] = convert(e.target.value);

                console.log('--', ref, this.state.data)
                this.setState(this.state);
            }
        };

        if (element.visible !== false) {
            if (element.type === 'string' ||
                element.type === 'number' ||
                element.type === 'date') {
                if (element.enum) {

                    return (
                        <Dropdown
                            label={element.description || key}
                            type={element.type !== 'string' ? element.type : 'text'}
                            options={element.enum}
                            value={lastRef[name]}
                            onChange={onChange(path)}
                            ref={key}>
                        </Dropdown>
                    )
                } else {

                    let validators = []


                    if (element.minLength) {
                        validators.push(new MinValidation(element.minLength))
                    }

                    if (element.pattern) {
                        validators.push(new RegexValidation(new RegExp(element.pattern)))
                    }

                    if (element.format && element.format.toLowerCase() === 'uri') {
                        validators.push(new RegexValidation(
                            new RegExp(/^(?:[a-z][a-z0-9+-.]*)?(?:\:|\/)\/?[^\s]*$/i),
                            'URL Format'))
                    }

                    return (
                        <Input label={element.description || key}
                               type={element.type !== 'string' ? element.type : 'text'}
                               ref={key}
                               value={lastRef[name]}
                               validate={validators}
                               submit={this.state.submit}
                               onChange={onChange(path)}/>
                    )


                }
            }
        }
    }

}

export default ComponentFactory