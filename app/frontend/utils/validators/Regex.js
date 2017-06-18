class RegexValidation {

    constructor(regex, message) {

        this.message = message || `The value must match ${regex.toString()} format`
        this.regex = regex
        this.validate = (value) => {
            return regex.test(value)
        }
    }

}

export default RegexValidation