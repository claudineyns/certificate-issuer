import { Injectable } from '@nestjs/common';
import { exec } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { rm, existsSync, readFileSync } from 'node:fs';

const env = process.env;
const cacerts = env.CA_PATH || `${env.HOME}/ca/cacerts`;

const removeFile = (path: string) => {
   return new Promise((resolve, reject) => {
     return rm(path, {force: true, recursive: false}, (err) => err ? reject(err) : resolve(true));
   });
};

const script = (command, resolve, reject) => exec(command, (error, stdout, stderr) => {
    if (error) return reject(error);
    return resolve({out: stdout, err: stderr});
});

const csr = async (cn: string, dn: string, resolve: Function, reject: Function) => {

  const outputKeyFile  = `/tmp/${cn}.key.pem`;
  const outputCertFile = `/tmp/${cn}.cert.pem`;
  const caKeyFile      = `${cacerts}/intermediateCA/private/intermediate.key.pem`;
  const caCertFile     = `${cacerts}/intermediateCA/certs/intermediate.cert.pem`;

  await removeFile(outputKeyFile);
  await removeFile(outputCertFile);

  // Este comando gera a requisição de certificado, junto com a chave privada de um solicitante, e já gera o certificado final x509
  const cmd = `
   openssl req
   -config ${cacerts}/openssl_intermediate.cnf
   -new
   -x509
   -CA    ${caCertFile}
   -CAkey ${caKeyFile}
   -sha256
   -extensions server_cert
   -noenc
   -newkey 4096
   -keyout ${outputKeyFile}
   -days 30
   -subj "${dn}"
   -out  ${outputCertFile}
   -batch`
   .replace(/[\r\n]/g,' ').replace(/\s+/g,' ');
 
 return script(cmd, (response) =>  {
   if( ! existsSync(outputKeyFile) ) return reject(new Error('Não foi possível gerar a chave privada da requisição'));
   if( ! existsSync(outputCertFile) ) return reject(new Error('Não foi possível gerar o certificado da requisição'));

   const cert = readFileSync(outputCertFile).toString('base64');
   const key  = readFileSync(outputKeyFile).toString('base64');

   return resolve({key, cert}); 
 }, reject);

};

@Injectable()
export class CertificateService {
  getHello(): string {
    return 'Certificate: Hello World!';
  }

  generateKeypair(cn: string, dn: string) {
     return new Promise( (resolve, reject) => csr(cn, dn, resolve, reject) );
  }

}

