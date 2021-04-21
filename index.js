var fs = require("fs")
class XML {
    constructor() {
        this.output = ""
        this.indent = "\t"
    }
    _escapeString(string) {
        return string && string.replace
            ? string.replace(/([&"<>'])/g, (_, item) => {
                return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[item];
            })
            : string;
    }
    _append(content) {
        if (content !== undefined) {
            this.output += content;
        }
    }
    _addXmlValue(value) {
        this._formatXmlStr(this._generateElement(value, this.indent, this.indent ? 1 : 0));
    }
    _getAttributes(obj, attributes) {
        Object.keys(obj).forEach((key) => {
            attributes.push(key + '=' + '"' + this._escapeString(obj[key]) + '"');
        });
    }
    _generateElement(data, indent, indent_count) {
        indent_count = indent_count || 0;
        var name;
        var values = data;
        if (typeof data === 'object') {
            var keys = Object.keys(data);
            name = keys[0];
            values = data[name];
        }
        var attributes = [];
        var children = [];
        var isStringContent;
        if (typeof values === "object") {
            if (values === null) return;
            if (values._attr) {
                this._getAttributes(values._attr, attributes);
            }
            if (values._cdata) {
                children.push(
                    ('<![CDATA[' + values._cdata).replace(/\]\]>/g, ']]]]><![CDATA[>') + ']]>'
                );
            }
            if (values.forEach) {
                isStringContent = false;
                children.push('');
                values.forEach((value) => {
                    if (typeof value == 'object') {
                        if (Object.keys(value)[0] == '_attr') {
                            this._getAttributes(value._attr, attributes);
                        } else {
                            children.push(this._generateElement(
                                value, indent, indent_count + 1));
                        }
                    } else {
                        children.pop();
                        isStringContent = true;
                        children.push(this._escapeString(value));
                    }
                });
                if (!isStringContent) {
                    children.push('');
                }
            }
        } else {
            children.push(this._escapeString(values));
        }
        return {
            name: name,
            attributes: attributes,
            children: children,
            indents: (new Array(indent_count || 0).join(indent || '')),
            indent: indent
        };
    }
    _formatXmlStr(element) {
        if (typeof element != 'object') {
            return this._append(element);
        }
        var len = element.children.length;
        let emptyChildren = (len === element.children.filter((c) => { return (typeof c === "string") && (c.trim().length === 0) }).length)
        this._append(element.indents
            + (element.name ? '<' + element.name : '')
            + (element.attributes.length ? ' ' + element.attributes.join(' ') : '')
            + (!emptyChildren ? (element.name ? '>' : '') : (element.name ? '/>' : ''))
            + (element.indent && len > 1 ? '\n' : ''));
        while (element.children.length) {
            var value = Array.prototype.shift.apply(element.children);
            if (value === undefined) continue;
            this._formatXmlStr(value);
        }
        if (!emptyChildren) {
            this._append((len > 1 ? element.indents : '')
                + (element.name ? '</' + element.name + '>' : '')
                + (element.indent ? '\n' : ''));
        }
    }
    json2xml(input) {
        if (input && input.forEach) {
            input.forEach((value) => {
                this._addXmlValue(value);
            });
        } else {
            this._addXmlValue(input);
        }
        return this.output;
    }
}
class WsdlGenerateUtil {
    constructor() {
        this.xml = new XML()
    }
    /**
     * 
     * @param {*} wsdlServerName 
     * @param {*} wsdlNameSpaceUrl 
     * @param {*} wsdlServerAddress 
     * @returns 
     */
    getWsdlTemplate(wsdlServerName, wsdlNameSpaceUrl, wsdlServerAddress) {
        let wsdlServerNameLowerCase = wsdlServerName.toLowerCase()
        return {
            name: "definitions",
            prefix: "wsdl",
            nameSpacePrefix: "xmlns",
            props: {
                name: wsdlServerName,
                targetNamespace: wsdlNameSpaceUrl + "/" + wsdlServerNameLowerCase + ".wsdl",
                tns: wsdlNameSpaceUrl,
                xsd1: wsdlNameSpaceUrl + "/" + wsdlServerNameLowerCase + ".wsdl",
                soap: "http://schemas.xmlsoap.org/wsdl/soap/",
                wsdl: "http://schemas.xmlsoap.org/wsdl/",
                soap12: "http://schemas.xmlsoap.org/wsdl/soap12/",
                soapenc: "http://schemas.xmlsoap.org/soap/encoding/"
            },
            children: [
                {
                    name: "types",
                    children: [
                        {
                            name: "schema",
                            prefix: "xsd",
                            props: {
                                targetNamespace: wsdlNameSpaceUrl + "/" + wsdlServerNameLowerCase + ".xsd",
                                xsd: "http://www.w3.org/2000/10/XMLSchema"
                            },
                            children: [
                            ]
                        },
                    ]
                },
                {
                    name: "portType",
                    props: {
                        name: wsdlServerName + "PortType"
                    },
                    children: [
                    ]
                }, {
                    name: "binding",
                    props: {
                        name: wsdlServerName + "SoapBinding",
                        type: "tns:" + wsdlServerName + "PortType"
                    }, children: [
                        {
                            name: "binding",
                            prefix: "soap",
                            props: {
                                style: "document",
                                transport: "http://schemas.xmlsoap.org/soap/http"
                            },
                            children: [
                            ]
                        },
                    ]
                },
                {
                    name: "service",
                    props: {
                        name: wsdlServerName + "Service"
                    },
                    children: [
                        {
                            name: "port",
                            props: {
                                name: wsdlServerName + "Port",
                                binding: "tns:" + wsdlServerName + "SoapBinding"
                            }
                            , children: [
                                {
                                    name: "address", props: {
                                        location: wsdlServerAddress
                                    }
                                }
                            ]
                        },
                    ]
                }
            ]
        }
    }
    /**
     * 
     * @param {*} propKey 
     * @param {*} propValue 
     * @returns 
     */
    isNameSpaceProp(propKey, propValue) {
        return /^http|s:\/\/?(.*)$/.test(propValue) && propKey !== "targetNamespace"
    }
    /**
     * 
     * @param {*} nameSpacePrefix 
     * @param {*} props 
     * @param {*} attr 
     */
    cloneProps(nameSpacePrefix, props, attr) {
        Object.keys(props).forEach((key) => {
            if (!this.isNameSpaceProp(key, props[key])) {
                attr[key] = props[key]
            } else {
                attr[nameSpacePrefix + ":" + key] = props[key]
            }
        })
    }
    /**
     * 
     * @param {*} funName 
     * @param {*} inputParams 
     * @param {*} outParams 
     * @param {*} json 
     */
    addFun(funName, inputParams, outParams, json) {
        json.children.forEach((childJson) => {
            if (childJson.name === "binding") {
                childJson.children.push({
                    name: "operation",
                    props: {
                        name: funName,
                    },
                    children: [
                        {
                            name: "operation",
                            prefix: "soap",
                            props: {
                                soapAction: "http://example.com/" + funName,
                            },
                        }, {
                            name: "input",
                            children: [
                                {
                                    name: "body",
                                    prefix: "soap",
                                    props: {
                                        use: "literal"
                                    }
                                }
                            ],
                        }, {
                            name: "output",
                            children: [
                                {
                                    name: "body",
                                    prefix: "soap",
                                    props: {
                                        use: "literal"
                                    }
                                }
                            ]
                        }
                    ]

                })
            } else if (childJson.name === "portType") {
                childJson.children.push({
                    name: "operation",
                    props: {
                        name: funName,
                    },
                    children: [
                        {
                            name: "input",
                            props: {
                                message: "tns:" + funName + "inputMsg"
                            }

                        }, {
                            name: "output",
                            props: {
                                message: "tns:" + funName + "outputMsg"
                            }
                        }
                    ]

                })
            } else if (childJson.name === "types") {
                let inputRequestElements = []
                let outputResponseElements = []
                let extraElements = []
                inputParams.forEach((param) => {
                    let element = {
                        name: "element",
                        props: {
                            name: param.name,
                            type: param.type
                        }
                    }
                    if (param.hasOwnProperty("ref")) {
                        let extraElement = { name: param.ref, children: [] }
                        param._extra.forEach((extraParam) => {
                            extraElement.children.push({
                                name: "element",
                                props: {
                                    name: extraParam.name,
                                    type: extraParam.type
                                }
                            })
                        })
                        extraElements.push(extraElement)
                        element.props.ref = param.ref
                    }
                    inputRequestElements.push(element)
                })
                outParams.forEach((param) => {
                    let element = {
                        name: "element",
                        props: {
                            name: param.name,
                            type: param.type
                        }
                    }
                    if (param.hasOwnProperty("ref")) {
                        let extraElement = { name: param.ref, children: [] }
                        param._extra.forEach((extraParam) => {
                            extraElement.children.push({
                                name: "element",
                                props: {
                                    name: extraParam.name,
                                    type: extraParam.type
                                }
                            })
                        })
                        extraElements.push(extraElement)
                        element.props.ref = param.ref
                    }
                    outputResponseElements.push(element)
                })
                extraElements.forEach((extraElement) => {
                    childJson.children[0].children.push({
                        name: "element",
                        props: {
                            name: extraElement.name,
                        },
                        children: [
                            {
                                name: "complexType",
                                children: [
                                    {
                                        name: "all",
                                        children: extraElement.children
                                    }
                                ]
                            }
                        ]
                    })
                })
                childJson.children[0].children.push({
                    name: "element",
                    props: {
                        name: funName + "Request"
                    },
                    children: [
                        {
                            name: "complexType",
                            children: [
                                {
                                    name: "all",
                                    children: inputRequestElements
                                }
                            ]
                        }
                    ]
                })
                childJson.children[0].children.push({
                    name: "element",
                    props: {
                        name: funName + "Response"
                    },
                    children: [
                        {
                            name: "complexType",
                            children: [
                                {
                                    name: "all",
                                    children: outputResponseElements
                                }
                            ]
                        }
                    ]
                })
            }
        })
        json.children.push({
            name: "message",
            props: {
                name: funName + "inputMsg"
            }, children: [
                {
                    name: "part",
                    props: {
                        name: "body",
                        element: "xsd1:" + funName + "Request"
                    }
                }
            ]
        })
        json.children.push({
            name: "message",
            props: {
                name: funName + "outputMsg"
            }, children: [
                {
                    name: "part",
                    props: {
                        name: "body",
                        element: "xsd1:" + funName + "Response"
                    }
                }
            ]
        })
    }
    /**
     * 
     * @param {*} prefix 
     * @param {*} nameSpacePrefix 
     * @param {*} jsonItem 
     * @returns 
     */
    handleJsonItem(prefix, nameSpacePrefix, jsonItem) {
        if (jsonItem.prefix) {
            prefix = jsonItem.prefix
        }
        let name = prefix + ":" + jsonItem.name
        let itemObj = {}
        let attrObj = { _attr: {} }
        var props = jsonItem.props
        itemObj[name] = []
        var attr = attrObj._attr
        if (props) {
            this.cloneProps(nameSpacePrefix, props, attr)
            itemObj[name].push(attrObj)
        }
        if (jsonItem.children) {
            jsonItem.children.forEach((childItem) => {
                itemObj[name].push(this.handleJsonItem(prefix, nameSpacePrefix, childItem))
            })
        }

        return itemObj
    }
    generateWsdlAndSave(json, name) {
        var jsonRoot = []
        let prefix = json.prefix
        let nameSpacePrefix = json.nameSpacePrefix
        let jsonRootObj = this.handleJsonItem(prefix, nameSpacePrefix, json)
        jsonRoot.push(jsonRootObj)


        if (fs.existsSync(name + ".wsdl")) {
            fs.unlinkSync(name + ".wsdl")
        }
        fs.writeFileSync(name + ".wsdl", this.xml.json2xml(jsonRoot))
    }
}
module.exports = WsdlGenerateUtil

