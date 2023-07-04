import { Module } from '@nestjs/common';
import { CertificateModule } from './certificate/certificate.module';

@Module({
  imports: [CertificateModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
