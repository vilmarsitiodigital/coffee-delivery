import {
  Bank,
  CreditCard,
  CurrencyDollar,
  MapPinLine,
  Money,
} from 'phosphor-react'
import axios, { AxiosError } from 'axios'
import { CartCard } from '../../components/CartCard'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { theme } from '../../styles/theme'
import {
  OrderDetailsCard,
  OrderDetailsHeader,
  Container,
  Content,
  InputsContainer,
  PaymentOptions,
  OrderSummary,
  Separator,
  OrderTotalPriceContainer,
  ConfirmOrderButton,
} from './styles'
import { ChangeEvent, FormEvent, Fragment, useContext, useState } from 'react'
import { transformCentsInReal } from '../../utils/transformCentsInReal'
import { useNavigate } from 'react-router-dom'
import { ShoppingCartContext } from '../../contexts/ShoppingCartContext'
import { toast } from 'react-toastify'
import { OrderDetailsContext } from '../../contexts/OrderDetailsContext'
import { PaymentType } from '../../@types/Payment'

export function Checkout() {
  const navigation = useNavigate()
  const { shoppingCartItems, resetShoppingCart } =
    useContext(ShoppingCartContext)
  const { address, paymentType, changeAddressByKey, selectPayment } =
    useContext(OrderDetailsContext)

  function handleChangeInput({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) {
    changeAddressByKey(name, value)
  }

  function handleSelectPayment(event: ChangeEvent<HTMLInputElement>) {
    selectPayment(event.target.value as PaymentType)
  }

  function handleConfirmOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigation('/success')
    resetShoppingCart()
    toast.success('Seu pedido foi confirmado e está sendo enviado!')
  }

  function checkIfAddressHasBeenFilledIn() {
    const hasAddressBeenFilled = Object.entries(address).every(
      ([key, value]) => {
        if (key === 'number') return true
        return value.trim().length > 0
      },
    )

    return hasAddressBeenFilled
  }

  function checkThatAllDataHasBeenFilledIn() {
    const isAllDataHasBeenFilledIn =
      shoppingCartItems.length > 0 &&
      paymentType &&
      checkIfAddressHasBeenFilledIn()

    return isAllDataHasBeenFilledIn
  }

  const totalPriceItemsInCents = shoppingCartItems.reduce(
    (acc, coffee) => acc + coffee.priceInCents * coffee.quantity,
    0,
  )
  const totalPriceItems = transformCentsInReal(totalPriceItemsInCents)

  const deliveryFeeInCents = checkIfAddressHasBeenFilledIn() ? 350 : 0
  const deliveryFee = deliveryFeeInCents
    ? transformCentsInReal(deliveryFeeInCents)
    : ''

  const orderTotal = transformCentsInReal(
    totalPriceItemsInCents + deliveryFeeInCents,
  )

  async function fetchCEPAndSetInputValues() {
    if (address.cep.length === 0) return
    return axios
      .get(`https://cep.awesomeapi.com.br/json/${address.cep}`)
      .then((response) => {
        const {
          address_type: addressType,
          address_name: street,
          state: UF,
          district,
          city,
        } = response.data
        changeAddressByKey('street', `${addressType} ${street}`)
        changeAddressByKey('uf', `${UF}`)
        changeAddressByKey('district', `${district}`)
        changeAddressByKey('city', `${city}`)
      })
      .catch((error: AxiosError) => {
        const statusCode = error.response?.status

        if (statusCode === 400 || statusCode === 404) {
          toast.warning('CEP não encontrado')
        }
      })
  }

  return (
    <Container>
      <Content onSubmit={handleConfirmOrder}>
        <div>
          <h2>Complete seu pedido</h2>

          <OrderDetailsCard>
            <OrderDetailsHeader>
              <MapPinLine size={22} color={theme.color.yellow[700]} />
              <div>
                <p>Endereço de Entrega</p>
                <p>Informe o endereço onde deseja receber seu pedido</p>
              </div>
            </OrderDetailsHeader>

            <InputsContainer>
              <Input
                label="CEP"
                value={address.cep}
                name="cep"
                onChange={handleChangeInput}
                onBlur={fetchCEPAndSetInputValues}
                maxLength={9}
                required
              />

              <Input
                label="Endereço"
                value={address.street}
                name="street"
                onChange={handleChangeInput}
                required
              />

              <Input
                label="Número"
                value={address.number}
                name="number"
                onChange={handleChangeInput}
                isOptional
              />

              <Input
                label="Complemento"
                value={address.complement}
                name="complement"
                onChange={handleChangeInput}
                required
              />

              <Input
                label="Bairro"
                value={address.district}
                name="district"
                onChange={handleChangeInput}
                required
              />

              <Input
                label="Cidade"
                value={address.city}
                name="city"
                onChange={handleChangeInput}
                required
              />

              <Input
                label="UF"
                value={address.uf}
                name="uf"
                onChange={handleChangeInput}
                maxLength={2}
                required
              />
            </InputsContainer>
          </OrderDetailsCard>

          <OrderDetailsCard>
            <OrderDetailsHeader>
              <CurrencyDollar size={22} color={theme.color.purple[500]} />
              <div>
                <p>Pagamento</p>
                <p>
                  O pagamento é feito na entrega. Escolha a forma que deseja
                  pagar
                </p>
              </div>
            </OrderDetailsHeader>

            <PaymentOptions>
              <Select
                checked={paymentType === 'CREDIT_CARD'}
                name="paymentType"
                value="CREDIT_CARD"
                onChange={handleSelectPayment}
                required
              >
                <CreditCard color={theme.color.purple[500]} />
                <p>Cartão de crédito</p>
              </Select>

              <Select
                checked={paymentType === 'DEBIT_CARD'}
                name="paymentType"
                value="DEBIT_CARD"
                onChange={handleSelectPayment}
                required
              >
                <Bank color={theme.color.purple[500]} />
                <p>cartão de débito</p>
              </Select>

              <Select
                checked={paymentType === 'MONEY'}
                name="paymentType"
                value="MONEY"
                onChange={handleSelectPayment}
                required
              >
                <Money color={theme.color.purple[500]} />
                <p>dinheiro</p>
              </Select>
            </PaymentOptions>
          </OrderDetailsCard>
        </div>

        <div>
          <h2>Cafés selecionados</h2>

          <OrderSummary>
            {shoppingCartItems.map((item) => (
              <Fragment key={item.id}>
                <CartCard data={item} />
                <Separator />
              </Fragment>
            ))}

            <OrderTotalPriceContainer>
              <div>
                <p>Total de itens</p>
                <p>{totalPriceItems}</p>
              </div>

              {deliveryFee && (
                <div>
                  <p>Entrega</p>
                  <p>{deliveryFee}</p>
                </div>
              )}

              <div>
                <p>Total</p>
                <p>{orderTotal}</p>
              </div>
            </OrderTotalPriceContainer>

            <ConfirmOrderButton
              type="submit"
              disabled={!checkThatAllDataHasBeenFilledIn()}
            >
              confirmar pedido
            </ConfirmOrderButton>
          </OrderSummary>
        </div>
      </Content>
    </Container>
  )
}
