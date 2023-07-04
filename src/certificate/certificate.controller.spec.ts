import { Test, TestingModule } from '@nestjs/testing';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';

describe('CertificateController', () => {
  let certificateController: CertificateController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CertificateController],
      providers: [CertificateService],
    }).compile();

    certificateController = app.get<CertificateController>(CertificateController);
  });

  describe('/certificate/home', () => {

    it('should return "Certificate: Hello World!"', () => {
      expect(certificateController.getHello()).toBe('Certificate: Hello World!');
    });

  });

});
