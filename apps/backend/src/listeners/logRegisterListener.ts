import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RegisterCreatedEvent } from '../events/register-created.event';

@Injectable()
export class LogRegisterListener {
  @OnEvent('register.created')
  handleOrderCreatedEvent(event: RegisterCreatedEvent) {
    console.log(`📝 Log: Usuario ${event.name} criado. Com email: ${event.userEmail}`);
  }
}