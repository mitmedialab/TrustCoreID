class MinValidation {

    constructor(characters, message) {
        if (!characters) {
            throw new Error('number of characters must be provided for the "min" validator')
        }

        this.num = characters
        this.message = message || `The provided value must be at least ${characters} characters long`
        this.validate = this.validate.bind(this)
    }

    validate(value) {
        return value && value.length > this.num
    }


}

export default MinValidation