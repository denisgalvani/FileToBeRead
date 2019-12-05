var data = JSON.stringify({
  "schemas": [
    "urn:scim:schemas:core:2.0:User",
    "urn:scim:schemas:extension:enterprise:2.0:User"
  ],
  "externalId": "caoa-systems@caoa.com.br",
  "meta": {},
  "userName": "CAOA-SYSTEMS",
  "displayName": "System Service User TOTVS Protheus CAOA",
  "title": "System Service User",
  "emails": [
    {
      "value": "caoa-systems@caoa.com.br",
      "primary": true
    }
  ],
  "active": true,
  "groups": [
    {
      "value": "000005"
    },
    {
      "value": "000006"
    }
  ],
  "password": "CaoaSystemsPass",
  "urn:scim:schemas:extension:totvs:2.0:User/forceChangePassword": true,
  "urn:scim:schemas:extension:enterprise:2.0:User/department": "Infraestrutura de Sistemas",
  "urn:scim:schemas:extension:totvs:2.0:User/groupRule": 3,
  "urn:scim:schemas:extension:enterprise:2.0:User": {
    "manager": [
      {
        "managerid": "000000"
      }
    ]
  }
});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "https://172.28.35.136:23687/rest/01/api/framework/v1/users/");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("User-Agent", "PostmanRuntime/7.19.0");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Postman-Token", "b822d963-80aa-444b-9b72-6fa2a670e5bf,31b731e6-9812-4c92-8dbd-31a441a9cdc2");
xhr.setRequestHeader("Host", "172.28.35.136:23687");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Content-Length", "1008");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);