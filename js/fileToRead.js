if (window.File && window.FileReader && window.FileList && window.Blob) {
	var fsObjUsersPass; // fluig style Users Pass --- VETOR DE OBJETOS Password fluig Style Guide
	var fileSelected = document.getElementById('txtfiletoread');
	fileSelected.addEventListener('change', function (e) {
		//Set the extension for the file
		//ARQUIVO CSV ".type" IGUAL "application/vnd.ms-excel"
		//ARQUIVO TEXT ".type" IGUAL "text/plain"
		//ARQUIVO XML ".type" IGUAL "text/xml"
		// var fileExtension = '/text.*/';
		var fileTypes = '((text\\/plain)|(application.+(excel)?)|(xml)).*';
		//Get the file object
		var fileTobeRead = fileSelected.files[0];

		//Check of the extension match
		//ARQUIVO EXTENSAO DESCONHECIDA RETORNA "type" VAZIO
		// if (fileTobeRead.type.match(fileExtension)) {
		if (fileTobeRead.type.match(fileTypes)) {
			//Initialize the FileReader object to read the 2file
			var fileReader = new FileReader();
			fileReader.onload = function (e) {
				console.info('#tableUsers > CARREGAMENTO ARQUIVO DE DADOS INDICADO');
				var texto = fileReader.result;
				var fileType = fileSelected.files[0].type;
				var dataArray;
				var infoAlertHtml =  '', infoData;
				var userRender = /* dataTableUsers.renderContent */ ['userName', 'emails', 'active', 'displayName', 'password', 'department', 'title', 'manager', 'groups', 'externalId', 'registration', 'forceChangePassword', 'groupRule'];
				var rowDataUser;

				fsObjUsersPass = new Array();

				infoAlertHtml += '<div class="alert alert-info alert-dismissible" role="alert">';
				infoAlertHtml += '\n	<button type="button" class="close" data-dismiss="alert">';
				infoAlertHtml += '\n		<span aria-hidden="true">×</span>';
				infoAlertHtml += '\n		<span class="sr-only">Close</span></button>';
				infoAlertHtml += '\n	<strong>Dados dispon&iacute;veis:</strong> ';
				infoAlertHtml += '\n	${infoData} ';
				infoAlertHtml += '\n</div>';

				//LEITURA ARQUIVO TEXTO / CSV
				// if (!!fileType.match('text/xml') && fileType.match('plain|excel')) {
				if (fileType.match('plain|excel')) {
					dataArray = texto.split(/\n/);
					if (dataArray.length < 1) {
						console.info(">> fileToRead.js > File is TEXT :: YES :: VAZIO :: dataArray.length > 0 :: false ");
						console.info(">> fileToRead.js > File is TEXT :: YES :: -->> " + "dataArray: { 'length': " + dataArray.length.toString() + "}");
					}
					else {
						dataUsers = new Array();
						dataTableUsers.reload(dataUsers,'.tableUserLine');
						rowCount = 0;

						for (var i = 0; i < dataArray.length; i++) {
							dataArray[i] = dataArray[i].split(';');

							if (typeof(dataArray[i]) == 'object' && dataArray[i][0].length == 0) {
								continue;
							}

							rowDataUser = {};
							for (var j = 0; j < userRender.length; j++) {
								rowDataUser[userRender[j]] = dataArray[i][j];
								if (typeof(dataArray[i][j]) != 'undefined' && userRender[j].match('manager|groups') && dataArray[i][j].indexOf('[') != -1 && dataArray[i][j].indexOf(']') != -1) {
									rowDataUser[userRender[j]] = dataArray[i][j].replace('[','').replace(']','').replace(',',', ');
								}
							}
					
							dataTableUsers.addRow(rowCount++, rowDataUser, '.tableUserLine');
							//fluig Style Guide - Password Field Object
							//JSON.parse( String('{\"prefix_').concat(123).concat('\": ').concat('\"valor abc\"}') )
							passVariable = ('userPass_' + rowDataUser.userName);
							fsObjUsersPass[passVariable] = FLUIGC.password('#' + passVariable, {
															    eyeClass: 'fluigicon',
															    eyeOpenClass: 'fluigicon-eye-open',
															    eyeCloseClass: 'fluigicon-key'
															});

							//COLUNA "ALTERAR SENHA", CAMPO CHECKBOX
							passVariable = ('changePassUser_' + rowDataUser.userName);
							if ( $('#' + passVariable).length > 0 ) {
								$('#' + passVariable).removeAttr('checked'); //LIMPAR ATRIBUTO HTML E DOM PROPERTY
								if ( rowDataUser.forceChangePassword.match('true') ) {
									$('#' + passVariable).attr('checked', true );
									$('#' + passVariable).prop('checked', true );
								}
								// FIXED // FLUIGC.switcher.init - Criação individual
								//       // Usar .initAll na tabela ao final do carregamento falha na 
								//       // renderização, exibição da opção selecionada e funcionamento (alteração do valor)
								FLUIGC.switcher.init('#' + passVariable);
							}
						}

						infoData  = new String(dataArray[0].length).toString() + ' colunas, ';
						// infoData += new String(dataArray.length).toString() + ' ' + ( (dataArray.length < 1)?'vazio':( (dataArray.length == 1)?'item':'itens' ) ) + '.';
						infoData += new String(rowCount).toString() + ' ' + ( (dataArray.length < 1)?'vazio':( (dataArray.length == 1)?'item':'itens' ) ) + '.';
						infoAlertHtml = infoAlertHtml.replace('${infoData}', infoData);

						$('#alertsFileTobeRead').html(infoAlertHtml);

						/*
						<div class="alert alert-info alert-dismissible" role="alert">
							<button type="button" class="close" data-dismiss="alert">
								<span aria-hidden="true">×</span>
								<span class="sr-only">Close</span></button>
							<strong>Dados dispon&iacute;veis:</strong> 13 colunas, 2 itens.
						</div>
						*/
					
						$('textarea[name=dataSaved]').text( JSON.stringify( dataArray ) );

					}
				}
				else {
					console.info(">> fileToRead.js > File is TEXT :: NOT :: fileType.match('plain|excel') :: false ");
					console.info(">> fileToRead.js > File is TEXT :: NOT :: -->> " + "fileSelected.files[0]: { 'name': '" + fileSelected.files[0].name + "', 'type': '" + fileSelected.files[0].type + "'}");
				}

				//LEITURA ARQUIVO PADRAO XML
				if (fileType.match('text/xml')) {
					console.info(">> fileToRead.js > File is XML :: YES :: fileSelected.files[0].type.match('text/xml') :: true ");
					if (window.DOMParser){
						parser = new DOMParser();
						xmlDoc = parser.parseFromString(fileReader.result, "text/xml");

						dataUsers = new Array();
						dataTableUsers.reload(dataUsers,'.tableUserLine');
						rowCount = 0;
						dataArray = new Array();
						$('protheus-user-data', xmlDoc.children).each( function(it, el) {
							itemData = new Array();

							rowDataUser = {};
							$(el.children).each( function(userIndex,userCollumn) {
								itemData.push( userCollumn.innerHTML );
								rowDataUser[userRender[userIndex]] = userCollumn.innerHTML;
								if (userRender[userIndex].match('manager|groups') && rowDataUser[userRender[userIndex]].indexOf('[') != -1 && rowDataUser[userRender[userIndex]].indexOf(']') != -1) {
									rowDataUser[userRender[userIndex]] = rowDataUser[userRender[userIndex]].replace('[','').replace(']','').replace(',',', ');
								}
							});

							dataArray.push(new Array( itemData ));
							dataTableUsers.addRow(rowCount++, rowDataUser, '.tableUserLine');

							//fluig Style Guide - Password Field Object
							//JSON.parse( String('{\"prefix_').concat(123).concat('\": ').concat('\"valor abc\"}') )
							passVariable = ('userPass_' + rowDataUser.userName);
							fsObjUsersPass[passVariable] = FLUIGC.password('#' + passVariable, {
															    eyeClass: 'fluigicon',
															    eyeOpenClass: 'fluigicon-eye-open',
															    eyeCloseClass: 'fluigicon-key'
															});

							//COLUNA "ALTERAR SENHA", CAMPO CHECKBOX
							passVariable = ('changePassUser_' + rowDataUser.userName);
							if ( $('#' + passVariable).length > 0 ) {
								$('#' + passVariable).removeAttr('checked'); //LIMPAR ATRIBUTO HTML E DOM PROPERTY
								if ( rowDataUser.forceChangePassword.match('true') ) {
									$('#' + passVariable).attr('checked', true );
									$('#' + passVariable).prop('checked', true );
								}
								// FIXED // FLUIGC.switcher.init - Criação individual
								//       // Usar .initAll na tabela ao final do carregamento falha na 
								//       // renderização, exibição da opção selecionada e funcionamento (alteração do valor)
								FLUIGC.switcher.init('#' + passVariable);
							}
						});

						// dataUsers = new Array();
						// dataTableUsers.reload(dataUsers,'.tableUserLine');
						// rowCount = 0;

						// for (var i = 0; i < dataArray.length; i++) {
						// 	dataArray[i] = dataArray[i].split(';');

						// 	rowDataUser = {};
						// 	for (var j = 0; j < userRender.length; j++) {
						// 		rowDataUser[userRender[j]] = dataArray[i][j];
						// 	}
					
						// 	dataTableUsers.addRow(rowCount++, rowDataUser, '.tableUserLine');
						// }

						
						infoData  = new String( $('protheus-user-data:first', xmlDoc.children).children().length ).toString() + ' colunas, ';
						infoData += new String( $('protheus-user-data', xmlDoc.children).length).toString() + ' ' + ( (dataArray.length < 1)?'vazio':( (dataArray.length == 1)?'item':'itens' ) ) + '.';
						infoAlertHtml = infoAlertHtml.replace('${infoData}', infoData);

						$('#alertsFileTobeRead').html(infoAlertHtml);
					}
					else // Internet Explorer
					{
						xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
						xmlDoc.async = false;
						xmlDoc.loadXML(fileReader.result);
					}
				}
				else {
					console.info(">> fileToRead.js > File is XML :: NOT :: fileSelected.files[0].type.match('text/xml') :: false ");
					console.info(">> fileToRead.js > File is XML :: NOT :: -->> " + "fileSelected.files[0]: { 'name': '" + fileSelected.files[0].name + "', 'type': '" + fileSelected.files[0].type + "'}");
				}
				
				// fluig Style Guide - JavaScript Switcher
				// TRANSFORMAR CAMPOS checkboxes / radios
				// ERROR // FLUIGC.switcher.init('#' + 'tableUsers'); 
				//       // APLICAR AO ID DA TABELA REDUZ LARGURA DA DIV / SCROLL
				// ERROR // FLUIGC.switcher.init('.' + 'appSwitcherStyle');
				// FIXED // FLUIGC.switcher.init - Criação individual
				//       // Usar .initAll na tabela ao final do carregamento falha na 
				//       // renderização, exibição da opção selecionada e funcionamento (alteração do valor)

			}
			fileReader.readAsText(fileTobeRead);

			FLUIGC.toast({
				title: 'Arquivo indicado: ',
				message: 'Conte&uacute;do listado na tabela',
				type: 'info'
			});
		}
		else {
			alert("Por favor selecione arquivo texto");

			FLUIGC.toast({
				title: 'Arquivo inv&aacute;lido! ',
				message: 'Selecione arquivo texto (extens&atilde;o TXT, CSV ou XML), confira <strong>Mais Instru&ccedil;&otilde;es</strong>',
				type: 'danger'
			});
		}
	});
}

// FileList // fileSelected.files.length
// FileList // fileSelected.files[0].lastModified: 1574777351708
// FileList // fileSelected.files[0].lastModifiedDate: Tue Nov 26 2019 11:09:11 GMT-0300 (Horário Padrão de Brasília) {}
// FileList // fileSelected.files[0].name: "fileToRead___TEXT__USERS__mode-semicolon.csv"
// FileList // fileSelected.files[0].size: 450
// FileList // fileSelected.files[0].type: "application/vnd.ms-excel"
// FileList // fileSelected.files[0].webkitRelativePath: ""
// 
// fileTobeRead = fileSelected.files[0]
// fileTobeRead.lastModified: 1574777351708
// fileTobeRead.lastModifiedDate: Tue Nov 26 2019 11:09:11 GMT-0300 (Horário Padrão de Brasília) {}
// fileTobeRead.name: "fileToRead___TEXT__USERS__mode-semicolon.csv"
// fileTobeRead.size: 450
// fileTobeRead.type: "application/vnd.ms-excel"
// fileTobeRead.webkitRelativePath: ""
// 
// fileTobeRead.type.match('text.*|excel')
// fileTobeRead.type.match('/text|excel/')
// fileTobeRead.type.match(/text|application.*/) // **
// fileTobeRead.type.match(/text|(application(.*excel)?).*/) // *?!*
// fileTobeRead.type.match(/((text\/plain)|(application.+(excel)?)|(xml)).*/) // *?!*
// 
// fileTobeRead.name.match(/\.(txt|xml|CSV)$/i) // ** OK
// 
// fileReader // e.loaded /* = 450 bytes */ ; e.total /* = 450 bytes */
// fileReader.result.split(/\n/) /* QUEBRA DE LINHAS */
// fileReader.result.split(/\r/) /* QUEBRA DE LINHAS */
// fileReader.result.split(/\r\n/) /* QUEBRA DE LINHAS */
// fileReader.result.split('\r\n') /* QUEBRA DE LINHAS */
// fileReader.result.split('\n') /* QUEBRA DE LINHAS */
// fileReader.result.split('\r') /* QUEBRA DE LINHAS */
// fileReader.result.split(/\n/)[0].split(';')