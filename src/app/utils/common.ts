declare var require: any;
const format = require('format-number');

export const statusProposta = {
  1: {text: 'Novo Lead', class: 'bg-yellow', icon: 'fa-concierge-bell'},
  2: {text: 'Em Andamento', class: 'bg-yellow'},
  3: {text: 'Confecção do contrato', class: 'bg-info'},
  4: {text: 'Assinatura', class: 'bg-success'},
  5: {text: 'Encerrado', class: 'bg-primary'}
};

export function removeAcento(text) {
  if (text) {
    text = text.toLowerCase();
    text = text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
    return text.replace(/'/g, '`');
  } else {
    return text;
  }
}

export function formatNum(
  valor: any,
  precisao?: number,
  to?: string,
  prefixo?: string,
  sufixo?: string
) {
  precisao = precisao || precisao === 0 ? precisao : 2;

  if (valor === null || typeof valor === 'undefined') {
    return null;
  }

  to = to || 'sys';

  if (to === 'pt_BR') {
    return format({
      prefix: prefixo || '',
      suffix: sufixo || '',
      integerSeparator: '.',
      decimal: ',',
      padRight: precisao,
      round: precisao
    })(valor);
  } else if (to === 'sys') {
    if (valor.constructor !== String) {
      valor = valor.toString();
    }

    if (valor.replace(/[^\d]*/gi, '').length === 0) {
      return null;
    }

    valor = parseFloat(
      valor
        .replace(/[^\d\.,]/g, '')
        .replace('.', '')
        .replace(',', '.')
    );
    return Math.round(valor * 1.0 * Math.pow(10, precisao)) / Math.pow(10, precisao);
  } else if (to === 'round') {
    return (
      Math.round(parseFloat(String(valor * 1.0)) * Math.pow(10, precisao)) / Math.pow(10, precisao)
    );
  }
}

export interface DataConfig {
  toUpper?: boolean;
  toUpperIgnored?: string[]
}

export function limparDados(objeto, cfg: DataConfig = {} as DataConfig, removeEmptyArray = false) {
  for (const propriedade in objeto) {
    if (objeto.hasOwnProperty(propriedade) && objeto[propriedade] === undefined || objeto[propriedade] === null || objeto[propriedade] === 'null') {
      objeto[propriedade] = '';
    } else if (objeto[propriedade] === false || objeto[propriedade] === 'false') {
      objeto[propriedade] = 0;
    } else if (objeto[propriedade] === true || objeto[propriedade] === 'true') {
      objeto[propriedade] = 1;
    } else if (typeof objeto[propriedade] === 'string' && cfg?.toUpper === true && !((cfg?.toUpperIgnored || []).includes(propriedade))) {
      objeto[propriedade] = objeto[propriedade].toUpperCase();
    } else if (typeof objeto[propriedade] === 'object') {
      if (removeEmptyArray && Array.isArray(objeto[propriedade]) && objeto[propriedade].length <= 0) {
        delete objeto[propriedade];
      } else {
        limparDados(objeto[propriedade], cfg, removeEmptyArray);
      }
    }
  }
}

export function imprimir(html = null) {
  const win = window.open('', 'blank');
  win.document.head.innerHTML = document.head.innerHTML.replace(`href="/`, `href="${window.location.protocol}//${window.location.host}/`);

  if (!html) {
    const shows: any = document.body.getElementsByClassName('show-in-print');
    if (shows.length) {
      for (let i = 0; i < shows.length; i++) {
        shows[i].style.display = 'block';
      }
    }

    win.document.body.innerHTML = document.getElementById('printable').innerHTML;


    if (shows.length) {
      for (let i = 0; i < shows.length; i++) {
        shows[i].style.display = 'none';
      }
    }
  } else {
    win.document.body.innerHTML = html;
  }

  const printFunction = function() {
    setTimeout(() => {
      win.onafterprint = function() {
        win.close();
      };
      win.print();
    }, 1000);
  };

  setTimeout(() => {
    // win.onload = printFunction;
    printFunction();
  }, 1000);
}

export function findObjectByKey(array, key, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }

  return null;
}

export function abrirPdfNovaAba(title: string, content: string) {
  const w = window.open('about:blank');
  w.document.title = title;

  const iframe = <HTMLIFrameElement> w.document.createElement('iframe');
  iframe.setAttribute('style', 'position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;');
  iframe.src = `data:application/pdf;base64,${content}`;

  setTimeout(function() { //FireFox
    w.document.body.appendChild(iframe);
  }, 0);

  return false;
}

export function serialize(obj: any, prefix: any) {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? prefix + '[' + p + ']' : p, v = obj[p];
      str.push((v !== null && typeof v === 'object') ? serialize(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }
  return str.join('&');
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ############################################################################################################################################################################################################
// ############################################################################################################################################################################################################
// NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR     // NÃO ALTERAR
export const IMOBILIARIA = (host = 'apresentacao.plenoimob.com.br') => (window.location.host.includes('plenoimob') || window.location.host.includes('segpleno')) ? window.location.host : host; // NÃO ALTERAR
// NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR // NÃO ALTERAR
// #################################################################################################################################################################
// #################################################################################################################################################################

export enum Sistemas {
  locacao = 1,
  financeiro,
  vistoria,
  assinatura,
  segpleno
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function detectmob() {
  return !!(navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    || window.innerWidth <= 1200);
}

export function array_unique<T>(obj: Array<T>) {
  return Array.from(new Set(obj.map((aux) => JSON.stringify(aux)))).map((aux) => JSON.parse(aux)) as Array<T>;
}

export function corsAnywhere(link) {
  const corsAnywhere = !window.location.host.includes('plenoimob') ? 'https://cors-anywhere.herokuapp.com/' : '';
  return `${corsAnywhere}${link}`;
}
