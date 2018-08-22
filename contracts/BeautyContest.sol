pragma solidity ^0.4.2;

contract BeautyContest {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Массив для хранения аккаунтов
    mapping(address => bool) public voters;
    //Массив для хранения кандидатов
    mapping(uint => Candidate) public candidates;
    // Счётчик кандидатов
    //отдельная переменная нужна, потому что через маппинг это нельзя сделать
    uint public candidatesCount;

    // Событие голосование
    event votedEvent (
        uint indexed _candidateId
    );
    //Инициализация кандидатов (кандидаток) в конструкторе
    constructor () public {
        addCandidate("Manushi Chhillar");
        addCandidate("Stephanie Del Valle");
        addCandidate("Mireia Lalaguna");
    }
    //Добавить кандидатку
    function addCandidate (string _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
    // Функция голосования
    function vote (uint _candidateId) public {
        // избиратель не может голосовать повторно
        require(!voters[msg.sender]);

        // проверка на валидность кандидаток
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // записываем в массив проголосовавшего
        voters[msg.sender] = true;

        // обновляем счётчик голов
        candidates[_candidateId].voteCount ++;

        // вызываем событие голосование
        emit votedEvent(_candidateId);
    }
}
