import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AuthGuard, PermissionsGuard } from '../libraries/guards';
import { CartService } from './cart.service';
import {
  AddProductToCartPayload,
  AddProductToCartSchema,
} from './dto/addProductToCartDto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('')
  @ApiOperation({ summary: 'Add product to cart' })
  @UsePipes(new ZodValidationPipe(AddProductToCartSchema))
  @ApiBody({ schema: zodToApi(AddProductToCartSchema) })
  @ApiOkResponse({ description: `Product added to cart successfully` })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async addToCart(
    @Body() payload: AddProductToCartPayload,
    @Req() req: FastifyRequest
  ) {
    const userId = req?.user?.userId as string;
    const data = await this.cartService.addProductToCart({
      payload,
      userId,
    });
    return convertAndSendResponse(data);
  }

  @Get('')
  @ApiOperation({ summary: 'Get cart items' })
  @ApiOkResponse({ description: 'Cart items fetched successfully' })
  async fetchCart(@Req() req: FastifyRequest) {
    const userId = req.user?.userId as string;
    const data = await this.cartService.fetchCartItems(userId);
    return convertAndSendResponse(data);
  }
 
  @Delete(':id')
  @ApiOperation({ summary: 'Remove cart item' })
  @ApiOkResponse({ description: 'Cart item removed successfully' })
  async removeCartItem(@Req() req: FastifyRequest, @Param('id') id: string,
) {
    const userId = req.user?.userId as string;
    const data = await this.cartService.removeCartItem({userId, id});
    return convertAndSendResponse(data);
  }
}
