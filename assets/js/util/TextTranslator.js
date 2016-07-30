
var TextTranslator={
	creatNew:function(){
		var TextTranslator={};

		TextTranslator.encodeText=function(TEXT){
			TEXT=TextTranslator.encodeAmpersand(TEXT);
			TEXT=TextTranslator.encodeLessThan(TEXT);
			TEXT=TextTranslator.encodeGreaterThan(TEXT);
			TEXT=TextTranslator.encodeQuotation(TEXT);
			TEXT=TextTranslator.encodeSpacing(TEXT);
			TEXT=TextTranslator.encodeEnter(TEXT);
			return TEXT;
		}

		TextTranslator.decodeText=function(TEXT){
			TEXT=TextTranslator.decodeLessThan(TEXT);
			TEXT=TextTranslator.decodeGreaterThan(TEXT);
			TEXT=TextTranslator.decodeQuotation(TEXT);
			TEXT=TextTranslator.decodeQuotation(TEXT);
			TEXT=TextTranslator.decodeSpacing(TEXT);
			TEXT=TextTranslator.decodeEnter(TEXT);
			return TEXT;
		}

		/*
		回车转空格
		 */
		TextTranslator.encodeEnterToSpacing=function(TEXT){
			return TEXT.replace(/<br>/g,"&nbsp");
		}	

		/*
		小于号转译
		 */
		TextTranslator.encodeLessThan=function(TEXT){
			return TEXT.replace(/</g,"&lt;");
		} 

		TextTranslator.decodeLessThan=function(TEXT){
			return TEXT.replace(/&lt;/g,"<");
		}

		/*
		大于号转译
		 */
		TextTranslator.encodeGreaterThan=function(TEXT){
			return TEXT.replace(/>/g,"&gt;");
		}

		TextTranslator.decodeGreaterThan=function(TEXT){
			return TEXT.replace(/&gt;/g,">");
		}

		/*
		&转译
		注意，由于所有的转译后字符串都含有&，所以&转译要注意先后顺序
		 */
		TextTranslator.encodeAmpersand=function(TEXT){
			return TEXT.replace(/&/g,"&amp;");
		}

		TextTranslator.decodeAmpersand=function(TEXT){
			return TEXT.replace(/&amp;/g,"&");
		}

		/*
		双引号转译
		 */
		TextTranslator.encodeQuotation=function(TEXT){
			return TEXT.replace(/\"/g,"&quot;");
		}

		TextTranslator.decodeQuotation=function(TEXT){
			return TEXT.replace(/&quot;/g,"\"");
		}

		/*
		单引号转译
		 */
		TextTranslator.encodeApostrophe=function(TEXT){
			return TEXT.replace(/\'/g,"&apos;");
		}

		/*
		空格转译
		 */
		TextTranslator.encodeSpacing=function(TEXT){
			return TEXT.replace(/[ ]/g,"&nbsp;");
		}

		TextTranslator.decodeSpacing=function(TEXT){
			return TEXT.replace(/&nbsp;/g," ");
		}

		/*
		回车转译
		 */
		TextTranslator.encodeEnter=function(TEXT){
			return TEXT.replace(/\n/g,"<br>");
		}

		TextTranslator.decodeEnter=function(TEXT){
			return TEXT.replace(/<br>/g,"\n");
		}

		return TextTranslator;
	}
}