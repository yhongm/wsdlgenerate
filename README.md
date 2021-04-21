# 通过 nodejs 生成 wsdl 文件

# generate wsdl file by nodejs

## example

### 代码

```javascript
const WsdlGenerateUtil = require("wsdlGenerate");
let wsdlGenerateUtil = new WsdlGenerateUtil();

let json = wsdlGenerateUtil.getWsdlTemplate(
  "example",
  "http://example.com",
  "http://127.0.0.1:80/example.wsdl",
);
wsdlGenerateUtil.addFun(
  "GetCardInfo",
  [
    { name: "card_no", type: "string" },
    { name: "pin", type: "string" },
    { name: "tran_channel", type: "int" },
    { name: "machine_code", type: "string" },
    { name: "sign", type: "string" },
  ],
  [
    { name: "retcode", type: "int" },
    { name: "sign", type: "string" },
    {
      name: "detail",
      type: "object",
      ref: "Detail",
      _extra: [
        { name: "name", type: "string" },
        { name: "load_flag", type: "int" },
      ],
    },
  ],
  json,
);
wsdlGenerateUtil.generateWsdlAndSave(json, "example");
```

### 生成的 wsdl

```xml
<wsdl:definitions name="example" targetNamespace="http://example.com/example.wsdl" xmlns:tns="http://example.com" xmlns:xsd1="http://example.com/example.wsdl" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">
	<wsdl:types>
		<xsd:schema targetNamespace="http://example.com/example.xsd" xmlns:xsd="http://www.w3.org/2000/10/XMLSchema">
			<xsd:element name="Detail">
				<xsd:complexType>
					<xsd:all>
						<xsd:element name="name" type="string"/>
						<xsd:element name="load_flag" type="int"/>
					</xsd:all>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="GetCardInfoRequest">
				<xsd:complexType>
					<xsd:all>
						<xsd:element name="card_no" type="string"/>
						<xsd:element name="pin" type="string"/>
						<xsd:element name="tran_channel" type="int"/>
						<xsd:element name="machine_code" type="string"/>
						<xsd:element name="sign" type="string"/>
					</xsd:all>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="GetCardInfoResponse">
				<xsd:complexType>
					<xsd:all>
						<xsd:element name="retcode" type="int"/>
						<xsd:element name="sign" type="string"/>
						<xsd:element name="detail" type="object" ref="Detail"/>
					</xsd:all>
				</xsd:complexType>
			</xsd:element>
		</xsd:schema>
	</wsdl:types>
	<wsdl:portType name="examplePortType">
		<wsdl:operation name="GetCardInfo">
			<wsdl:input message="tns:GetCardInfoinputMsg"/>
			<wsdl:output message="tns:GetCardInfooutputMsg"/>
		</wsdl:operation>
	</wsdl:portType>
	<wsdl:binding name="exampleSoapBinding" type="tns:examplePortType">
		<soap:binding style="document" xmlns:transport="http://schemas.xmlsoap.org/soap/http"/>
		<wsdl:operation name="GetCardInfo">
			<soap:operation xmlns:soapAction="http://example.com/GetCardInfo"/>
			<wsdl:input>
				<soap:body use="literal"/>
			</wsdl:input>
			<wsdl:output>
				<soap:body use="literal"/>
			</wsdl:output>
		</wsdl:operation>
	</wsdl:binding>
	<wsdl:service name="exampleService">
		<wsdl:port name="examplePort" binding="tns:exampleSoapBinding">
			<wsdl:address xmlns:location="http://127.0.0.1:80/example.wsdl"/>
		</wsdl:port>
	</wsdl:service>
	<wsdl:message name="GetCardInfoinputMsg">
		<wsdl:part name="body" element="xsd1:GetCardInfoRequest"/>
	</wsdl:message>
	<wsdl:message name="GetCardInfooutputMsg">
		<wsdl:part name="body" element="xsd1:GetCardInfoResponse"/>
	</wsdl:message>
</wsdl:definitions>


```
