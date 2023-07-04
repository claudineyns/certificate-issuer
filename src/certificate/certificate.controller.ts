import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CertificateService } from './certificate.service';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get('home')
  getHello(): string {
    return this.certificateService.getHello();
  }

  @Post('issue')
  async generateKeypair(@Req() request: any, @Res() response: any) {
    const { body } = request;

    const subject = Object.assign(
      {
        country: 'ZZ',
        stateOrProvince: 'FantasyLand',
        localityName: 'Paradise',
        organizationName: 'Acme Corp.',
        organizationalUnitName: 'Acme Software Development Center',
        commonName: 'api.acme.example.com',
        emailAddress: 'acme@example.com'
      }, { ... body }
    );

    const dn = `
       /C=${subject.country}
       /ST=${subject.stateOrProvince}
       /L=${subject.localityName}
       /O=${subject.organizationName}
       /OU=${subject.organizationalUnitName}
       /CN=${subject.commonName}
       /emailAddress=${subject.emailAddress}
    `.replace(/[\r\n]/g,'')
     .replace(/\s+/g,' ')
     .replace(/\s+\//g,'/')
     .replace(/\s+$/, '');

    const cn = subject.commonName;

    try {
      const rsa: any = await this.certificateService.generateKeypair(cn, dn);
      return response.status(200).json({...rsa, dn, subject});
    } catch(failure) {
      return response.status(400).json({error: failure.message});
    }

  }
}
