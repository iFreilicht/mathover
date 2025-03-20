from decimal import Decimal
from functools import lru_cache

from akk import Nx, Dx, Mx, Rx # type: ignore

# Math: w_oiejf

@lru_cache
def äx( *, x: int, n: int, k: int) -> Decimal:
    r"""Barwert einer sofort beginnenden, lebenslänglichen, jährlich vorschüssig
    zahlbaren Leibrente für eine x-jährige Person mit k abgelaufenen Jahren.

    $ä_x = \frac{N_{x+k}}{D_{x+k}}$

    """
    return Nx(x + k) / Dx(x + k)


@lru_cache
def äxn( *, x: int, n: int, k: int) -> Decimal:
    r"""Barwert einer sofort beginnenden und n Jahre dauernden jährlich vorschüssig
    zahlbaren Leibrente für eine x-jährige Person mit k abgelaufenen Jahren.

    $
    {ä}_{x:\angl{n}} = \frac{N_{x+k}-N_{x+n}}{D_{x+k}}
    $

    """
    zähler = Nx(x + k) - Nx(x + n)
    nenner = Dx(x + k)
    return zähler / nenner


@lru_cache
def näx( *, x: int, n: int, k: int) -> Decimal:
    r"""Barwert einer nach n Jahren beginnenden, lebenslänglichen, jährlich vorschüssig
    bzw. nachschüssig zahlbaren Leibrente für eine x-Jährige Person mit k abgelaufenen
    Jahren.

    $$
    {}_\rbar{n} ä_x = \frac{N_{x+n}}{D_{x+k}}
    $$

    """
    return Nx(x + n) / Dx(x + k)


def näxzbr(
     *, x: int, n: int, k: int, kzb: Decimal
) -> Decimal:
    r"""Barwert einer nach n Jahren beginnenden, lebenslänglichen, unterjährig in
    m Raten vorschüssig bzw. nachschüssig zahlbaren Leibrente für eine x-Jährige Person
    mit k abgelaufenen Jahren.

    $$
    {}_{\rbar{n}} {ä^{(m)}_{x}} =
    {}_{\rbar{n}} ä_x - (kzb_m \cdot {}_{n} E_x)
    $$

    """
    return näx( x=x, n=n, k=k) - (kzb * nEx( x=x, n=n, k=k))


@lru_cache
def Ax( *, x: int, k: int) -> Decimal:
    r"""Barwert einer lebenslänglichen Todesfallfallversicherung für eine x-jährige
    Person mit k abgelaufenen Jahren.

    $A_x = \frac{M_{x+k}}{D_{x+k}}$

    """
    return Mx(x + k) / Dx(x + k)


@lru_cache
def InAx( *, x: int, n: int, k: int) -> Decimal:
    r"""Barwert einer n-jährigen Risiko-Lebensversicherung für eine x-jährige Person
    mit k abgelaufenen Jahren.

    $$
    {}_\lbar{n} A_x = \frac{M_{x+k}-M_{x+n}}{D_{x+k}}
    $$

    """
    return (Mx(x + k) - Mx(x + n)) / Dx(x + k)


@lru_cache
def nEx( *, x: int, n: int, k: int) -> Decimal:
    r"""Barwert einer n-jährigen Erlebensfallversicherung für eine x-jährige Person
    mit k abgelaufenen Jahren.

    ${}_{n} E_x = \frac{D_{x+n}}{D_{x+k}}$

    """
    return Dx(x + n) / Dx(x + k)


@lru_cache
def än(*, i: Decimal, n: int) -> Decimal:
    r"""Barwert einer n Jahre lang laufenden, jährlich vorschüssig zahlbaren
    Zeitrente.

    $ä_n = \frac{1-v^n}{1-v}$

    """
    v = 1 / (1 + i)
    return (1 - v**n) / (1 - v)


@lru_cache
def änzbr(*, i: Decimal, n: int, kzb: Decimal) -> Decimal:
    r"""Barwert einer n Jahre lang laufenden, unterjährig in m Raten vorschüssig
    zahlbaren Zeitrente.

    ${ä^{(m)}_{n}} = ä_n \cdot (1-i \cdot kzb_m)$

    """
    return (än(i=i, n=n)) * (1 - i * kzb)


@lru_cache
def AFxn(*, x: int, n: int, k: int) -> Decimal:
    r"""Barwert einer jährlich linear von n auf 0 fallenden Risikolebensversicherung
    mit k abgelaufenen Jahren.

    $$
    (AF)_{x:\angl{n}} =
    \frac{(n-k-1) \cdot M_{x+k} - R_{x+k+1}-R_{x+n}}{D_{x+k}}
    $$

    """
    zähler = (n - k - 1) * Mx(x + k) - (Rx(x + k + 1) - Rx(x + n))
    nenner = Dx(x + k)
    return zähler / nenner