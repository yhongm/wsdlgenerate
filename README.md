# 通过 nodejs 生成 wsdl 文件

# generate wsdl file by nodejs

## example

### 代码

```javascript
const WsdlGenerateUtil = require("wsdlGenerate");
let wsdlGenerateUtil = new WsdlGenerateUtil()

let json = wsdlGenerateUtil.getWsdlTemplate("example", "http://example.com", "http://127.0.0.1:1099/test")
wsdlGenerateUtil.addFun("getCardNo",
    [{ name: "card_no", type: "string" },
    { name: "pin", type: "string" },
    { name: "equipment_code", type: "string" },
    { name: "sign", type: "string" }],
    [{ name: "retcode", type: "string" },
    { name: "sign", type: "string" },
    {
        name: "detail", ref: "Detail", useCustomElement: true, _extra:
            [{ name: "name", type: "string" },
            { name: "cust_postcode", type: "string" },
            { name: "fax", type: "string" }
            ]
    }
    ], json)
wsdlGenerateUtil.addFun("CheckCard", [
    { name: "card_no", type: "string" },
    { name: "retdetail", type: "string" },
    { name: "sign", type: "string" },
], [
    { name: "retcode", type: "string", maxOccurs: "unbounded", minOccurs: "0", nillable: "true" },
    { name: "mobile", type: "string" },
    { name: "sign", type: "string" },
], json)

wsdlGenerateUtil.addFun("listDetail", [
    { name: "merchcode", type: "string" },
    { name: "tran_channel", type: "string" },
    { name: "sign", type: "string" },
], [
    { name: "retcode", type: "string" },
    { name: "count", type: "int" },
    {
        name: "detailinfo", type: "string", _Type: {
            typeName: "detailinfoType",
            types: [
                { name: "card_no", type: 'string' },
                { name: "name", type: 'string' }, 
                { name: "sign", type: 'string' },
            ]
        }
    },

], json)

wsdlGenerateUtil.addFun("getPayType", [
    { name: "merchcode", type: "string" },
    { name: "tran_channel", type: "string" },
    { name: "sign", type: "string" }
], [
    { name: "retcode", type: "string" },
    { name: "paytype_desc", type: "string" },
    { name: "sign", type: "string" }
], json)
wsdlGenerateUtil.addComplexType({
    name: "testType", elements: [
        { name: "retcodeComplexType", type: "string", minOccurs: "0" },
        { name: "vcddd", type: "int", maxOccurs: "1" },
    ]
}, json)
wsdlGenerateUtil.addComplexType({
    name: "ArrayOfTest", elements: [
        { name: "test", type: "testType", useCustomElement: true, minOccurs: "0", maxOccurs: "unbounded" }
    ]
}, json)
wsdlGenerateUtil.addElement({
    name: "HelloElement", elements: [
        { name: "element1", type: "string",  minOccurs: "0", maxOccurs: "unbounded" ,nillable:"true"},
        { name: "element2", type: "int",  minOccurs: "0", maxOccurs: "1" ,nillable:"true"}
    ]
}, json)
wsdlGenerateUtil.addFun("getResult", [
    { name: "cnt", type: "int" },
    { name: "paytype", type: "string" },
    { name: "paytype_desc", type: "string" },
], [
    { name: "cnt", type: "int" },
    { name: "paytype", type: "string" },
    { name: "result", type: "ArrayOfTest", useCustomElement: true },
], json)
wsdlGenerateUtil.generateWsdlAndSave(json, "example")

```

### 生成的 wsdl

```xml
<wsdl:definitions name="example" targetNamespace="http://example.com" xmlns:tns="http://example.com" xmlns:n="http://example.com/example/Name/Types/" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">
	<wsdl:types>
		<xsd:schema targetNamespace="http://example.com/example/Name/Types/" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
			<xsd:element name="Detail">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="name" type="xsd:string"/>
						<xsd:element name="cust_postcode" type="xsd:string"/>
						<xsd:element name="fax" type="xsd:string"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="getCardNoRequest">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="card_no" type="xsd:string"/>
						<xsd:element name="pin" type="xsd:string"/>
						<xsd:element name="equipment_code" type="xsd:string"/>
						<xsd:element name="sign" type="xsd:string"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="getCardNoResponse">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="retcode" type="xsd:string"/>
						<xsd:element name="sign" type="xsd:string"/>
						<xsd:element ref="n:Detail"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="CheckCardRequest">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="card_no" type="xsd:string"/>
						<xsd:element name="retdetail" type="xsd:string"/>
						<xsd:element name="sign" type="xsd:string"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="CheckCardResponse">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="retcode" type="xsd:string" minOccurs="0" maxOccurs="unbounded" nillable="true"/>
						<xsd:element name="mobile" type="xsd:string"/>
						<xsd:element name="sign" type="xsd:string"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:complexType name="detailinfoType">
				<xsd:sequence>
					<xsd:element name="card_no" type="xsd:string"/>
					<xsd:element name="name" type="xsd:string"/>
					<xsd:element name="sign" type="xsd:string"/>
				</xsd:sequence>
			</xsd:complexType>
			<xsd:element name="listDetailRequest">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="merchcode" type="xsd:string"/>
						<xsd:element name="tran_channel" type="xsd:string"/>
						<xsd:element name="sign" type="xsd:string"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="listDetailResponse">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="retcode" type="xsd:string"/>
						<xsd:element name="count" type="xsd:int"/>
						<xsd:element name="detailinfo" type="n:detailinfoType"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="getPayTypeRequest">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="merchcode" type="xsd:string"/>
						<xsd:element name="tran_channel" type="xsd:string"/>
						<xsd:element name="sign" type="xsd:string"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="getPayTypeResponse">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="retcode" type="xsd:string"/>
						<xsd:element name="paytype_desc" type="xsd:string"/>
						<xsd:element name="sign" type="xsd:string"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:complexType name="testType">
				<xsd:sequence>
					<xsd:element name="retcodeComplexType" type="xsd:string" minOccurs="0"/>
					<xsd:element name="vcddd" type="xsd:int" maxOccurs="1"/>
				</xsd:sequence>
			</xsd:complexType>
			<xsd:complexType name="ArrayOfTest">
				<xsd:sequence>
					<xsd:element name="test" type="n:testType" minOccurs="0" maxOccurs="unbounded"/>
				</xsd:sequence>
			</xsd:complexType>
			<xsd:element name="HelloElement">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="element1" type="xsd:string" minOccurs="0" maxOccurs="unbounded" nillable="true"/>
						<xsd:element name="element2" type="xsd:int" minOccurs="0" maxOccurs="1" nillable="true"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="getResultRequest">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="cnt" type="xsd:int"/>
						<xsd:element name="paytype" type="xsd:string"/>
						<xsd:element name="paytype_desc" type="xsd:string"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
			<xsd:element name="getResultResponse">
				<xsd:complexType>
					<xsd:sequence>
						<xsd:element name="cnt" type="xsd:int"/>
						<xsd:element name="paytype" type="xsd:string"/>
						<xsd:element name="result" type="n:ArrayOfTest"/>
					</xsd:sequence>
				</xsd:complexType>
			</xsd:element>
		</xsd:schema>
	</wsdl:types>
	<wsdl:portType name="examplePortType">
		<wsdl:operation name="getCardNo">
			<wsdl:input message="tns:getCardNoinputMsg"/>
			<wsdl:output message="tns:getCardNooutputMsg"/>
		</wsdl:operation>
		<wsdl:operation name="CheckCard">
			<wsdl:input message="tns:CheckCardinputMsg"/>
			<wsdl:output message="tns:CheckCardoutputMsg"/>
		</wsdl:operation>
		<wsdl:operation name="listDetail">
			<wsdl:input message="tns:listDetailinputMsg"/>
			<wsdl:output message="tns:listDetailoutputMsg"/>
		</wsdl:operation>
		<wsdl:operation name="getPayType">
			<wsdl:input message="tns:getPayTypeinputMsg"/>
			<wsdl:output message="tns:getPayTypeoutputMsg"/>
		</wsdl:operation>
		<wsdl:operation name="getResult">
			<wsdl:input message="tns:getResultinputMsg"/>
			<wsdl:output message="tns:getResultoutputMsg"/>
		</wsdl:operation>
	</wsdl:portType>
	<wsdl:binding name="exampleSoapBinding" type="tns:examplePortType">
		<soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
		<wsdl:operation name="getCardNo">
			<soap:operation soapAction="http://example.com/getCardNo"/>
			<wsdl:input>
				<soap:body use="literal"/>
			</wsdl:input>
			<wsdl:output>
				<soap:body use="literal"/>
			</wsdl:output>
		</wsdl:operation>
		<wsdl:operation name="CheckCard">
			<soap:operation soapAction="http://example.com/CheckCard"/>
			<wsdl:input>
				<soap:body use="literal"/>
			</wsdl:input>
			<wsdl:output>
				<soap:body use="literal"/>
			</wsdl:output>
		</wsdl:operation>
		<wsdl:operation name="listDetail">
			<soap:operation soapAction="http://example.com/listDetail"/>
			<wsdl:input>
				<soap:body use="literal"/>
			</wsdl:input>
			<wsdl:output>
				<soap:body use="literal"/>
			</wsdl:output>
		</wsdl:operation>
		<wsdl:operation name="getPayType">
			<soap:operation soapAction="http://example.com/getPayType"/>
			<wsdl:input>
				<soap:body use="literal"/>
			</wsdl:input>
			<wsdl:output>
				<soap:body use="literal"/>
			</wsdl:output>
		</wsdl:operation>
		<wsdl:operation name="getResult">
			<soap:operation soapAction="http://example.com/getResult"/>
			<wsdl:input>
				<soap:body use="literal"/>
			</wsdl:input>
			<wsdl:output>
				<soap:body use="literal"/>
			</wsdl:output>
		</wsdl:operation>
	</wsdl:binding>
	<wsdl:service name="exampleService">
		<wsdl:port name="examplePortType" binding="tns:exampleSoapBinding">
			<soap:address location="http://127.0.0.1:1099/test"/>
		</wsdl:port>
	</wsdl:service>
	<wsdl:message name="getCardNoinputMsg">
		<wsdl:part name="body" element="n:getCardNoRequest"/>
	</wsdl:message>
	<wsdl:message name="getCardNooutputMsg">
		<wsdl:part name="body" element="n:getCardNoResponse"/>
	</wsdl:message>
	<wsdl:message name="CheckCardinputMsg">
		<wsdl:part name="body" element="n:CheckCardRequest"/>
	</wsdl:message>
	<wsdl:message name="CheckCardoutputMsg">
		<wsdl:part name="body" element="n:CheckCardResponse"/>
	</wsdl:message>
	<wsdl:message name="listDetailinputMsg">
		<wsdl:part name="body" element="n:listDetailRequest"/>
	</wsdl:message>
	<wsdl:message name="listDetailoutputMsg">
		<wsdl:part name="body" element="n:listDetailResponse"/>
	</wsdl:message>
	<wsdl:message name="getPayTypeinputMsg">
		<wsdl:part name="body" element="n:getPayTypeRequest"/>
	</wsdl:message>
	<wsdl:message name="getPayTypeoutputMsg">
		<wsdl:part name="body" element="n:getPayTypeResponse"/>
	</wsdl:message>
	<wsdl:message name="getResultinputMsg">
		<wsdl:part name="body" element="n:getResultRequest"/>
	</wsdl:message>
	<wsdl:message name="getResultoutputMsg">
		<wsdl:part name="body" element="n:getResultResponse"/>
	</wsdl:message>
</wsdl:definitions>



```
