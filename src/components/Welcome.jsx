import React from "react";

function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="mb-4 text-3xl font-bold text-blue-700">
        Bem-vindo ao Controle Financeiro!
      </h2>
      <p className="mb-6 text-lg text-gray-700">
        Este aplicativo foi desenvolvido para facilitar sua vida financeira.
      </p>
      <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md">
        <h3 className="mb-2 text-xl font-semibold text-gray-800">
          Sobre o Desenvolvedor
        </h3>
        <p className="mb-4 text-gray-600">
          Olá! Meu nome é Saulo Pavanello e sou desenvolvedora fullstack.
          <br />
          Se você gostou do app ou precisa de soluções personalizadas, entre em
          contato!
        </p>
        <div className="space-y-2">
          <a
            href="mailto:seuemail@exemplo.com"
            className="block text-blue-600 hover:underline"
          >
            saulopavanello@saulopavanello.com.br
          </a>
          <a
            href="https://www.linkedin.com/in/saulopavanello"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 hover:underline"
          >
            Acesse meu LinkedIn
          </a>
          <a
            href="https://github.com/MxSGameJPS"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 hover:underline"
          >
            Acesse meu GitHub
          </a>
          <a
            href="https://www.saulopavanello.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 hover:underline"
          >
            Acesse meu Portifólio
          </a>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
