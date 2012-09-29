var fs = require('fs'),
    jsminc = fs.readFileSync(__dirname + '/jsmin.c', 'utf8');

// Strip out includes
jsminc = jsminc.replace(/#include[^\n]+\s*/g, '');

// Replace static int with 'the' prefixes with vars
jsminc = jsminc.replace(/static int\s+(the[^\n]+)/g, function (_, varStr) {
  return 'var ' + varStr;
});

// Throw in an EOF before the first theA
jsminc = jsminc.replace('var theA;', 'var EOF = -1;\nvar theA;');

// Replace static void and static int with function
jsminc = jsminc.replace(/static void[^A-Za-z]*/g, 'function ');
jsminc = jsminc.replace(/static int[^A-Za-z]*/g, 'function ');
jsminc = jsminc.replace(/extern int[^A-Za-z]*/g, 'function ');

// Remove types from function statements
jsminc = jsminc.replace(/function ([^\(]+)\(([^\)]+)\)[^{]+/g, function (_, fnName, params) {
  var paramArr = params.split(', '),
      cleanParamArr = paramArr.map(function (param) {
        var paramSansFront = param.replace(/^[^\s]+\s+/, ''),
            paramSansBack = paramSansFront.replace('[]', '');
        return paramSansBack;
      }),
      cleanParams = cleanParamArr.join(', ');

  return 'function ' + fnName + '(' + cleanParams + ') ';
});

// Replace types inside functions with vars
jsminc = jsminc.replace(/int /g, 'var ');

// TODO: Strict equality
// TODO: Module.exports

// This should be fputs -> concatenates onto an error then exit(1) throws concatenated piece
// TODO: Handle fputs("JSMIN Error: ", stderr);
// TODO: Handle fputc('\n', stderr);
// TODO: Handle exit(1);

// TODO: Handle c = getc(stdin);
// TODO: Handle putc(theA, stdout);

// TODO: Handle fprintf(stdout, "// %s\n", argv[i]);

// Write out the converted file
fs.writeFileSync(__dirname + '/../lib/jsmin.c.js', jsminc, 'utf8');