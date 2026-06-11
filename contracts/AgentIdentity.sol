// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentIdentity {
    struct Agent {
        string name;
        string description;
        address owner;
        uint256 createdAt;
        bool active;
    }

    struct Analysis {
        uint256 id;
        string txHash;
        string summary;
        uint256 riskScore;
        uint256 timestamp;
    }

    address public admin;
    uint256 public agentCount;
    uint256 public analysisCount;

    mapping(uint256 => Agent) public agents;
    mapping(uint256 => Analysis) public analyses;
    mapping(address => uint256) public agentOf;

    event AgentRegistered(uint256 indexed id, string name, address indexed owner);
    event AnalysisLogged(uint256 indexed id, string txHash, uint256 riskScore);
    event AgentDeactivated(uint256 indexed id);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyAgentOwner(uint256 agentId) {
        require(agents[agentId].owner == msg.sender, "Not agent owner");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerAgent(string calldata _name, string calldata _description) external returns (uint256) {
        require(agentOf[msg.sender] == 0, "Already registered");
        agentCount++;
        agents[agentCount] = Agent({
            name: _name,
            description: _description,
            owner: msg.sender,
            createdAt: block.timestamp,
            active: true
        });
        agentOf[msg.sender] = agentCount;
        emit AgentRegistered(agentCount, _name, msg.sender);
        return agentCount;
    }

    function logAnalysis(
        string calldata _txHash,
        string calldata _summary,
        uint256 _riskScore
    ) external returns (uint256) {
        require(agentOf[msg.sender] != 0, "Not registered");
        require(_riskScore <= 10, "Risk score must be 0-10");
        analysisCount++;
        analyses[analysisCount] = Analysis({
            id: analysisCount,
            txHash: _txHash,
            summary: _summary,
            riskScore: _riskScore,
            timestamp: block.timestamp
        });
        emit AnalysisLogged(analysisCount, _txHash, _riskScore);
        return analysisCount;
    }

    function getAgent(uint256 _id) external view returns (Agent memory) {
        require(_id <= agentCount && _id > 0, "Invalid ID");
        return agents[_id];
    }

    function getMyAgentId() external view returns (uint256) {
        return agentOf[msg.sender];
    }

    function getAnalysis(uint256 _id) external view returns (Analysis memory) {
        require(_id <= analysisCount && _id > 0, "Invalid ID");
        return analyses[_id];
    }

    function getAnalysisCount(address _agent) external view returns (uint256) {
        uint256 id = agentOf[_agent];
        if (id == 0) return 0;
        uint256 count = 0;
        for (uint256 i = 1; i <= analysisCount; i++) {
            if (bytes(analyses[i].txHash).length > 0) count++;
        }
        return count;
    }
}
