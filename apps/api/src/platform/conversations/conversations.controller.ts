import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../auth/audience.decorator.js';
import { ConversationsService } from './conversations.service.js';

/**
 * The conversational layer used by every module: intake, plan edits, scoring, approvals, alerts.
 * Voice and text are equal citizens (NFR-U07).
 */
@ApiTags('conversations')
@Audience('any')
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversations: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'Start a conversation bound to a context (intake, procurement, contract...)' })
  start(@Body() body: { contextType: string; contextId?: string }) {
    return this.conversations.start(body.contextType, body.contextId);
  }

  @Post(':conversationId/messages')
  @ApiOperation({
    summary: 'Send a text turn; returns the AI reply, proposed field updates and follow-up questions',
    description: 'Requirements: FR-0006, FR-0010, FR-0035, FR-0745, NFR-P01',
  })
  sendText(@Param('conversationId') conversationId: string, @Body() body: { text: string }) {
    return this.conversations.handleTurn(conversationId, { kind: 'text', text: body.text });
  }

  @Post(':conversationId/audio')
  @ApiOperation({
    summary: 'Send a voice turn (transcribed, then handled like text; reply can be synthesised to speech)',
    description: 'Requirements: FR-0005, NFR-U07. BRS §5.4 Transcribe/Polly',
  })
  sendAudio(@Param('conversationId') conversationId: string, @Body() body: { audioBase64: string; mimeType: string }) {
    return this.conversations.handleTurn(conversationId, { kind: 'audio', ...body });
  }
}
