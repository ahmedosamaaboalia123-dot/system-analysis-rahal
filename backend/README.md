# Backend boundaries

The backend will be a modular monolith. The ownership manifest reserves domain and system paths
for A1, A2, and A3. Cross-domain dependencies use reviewed ports, events, and public contracts.
S03 owns database infrastructure. The S02 test fixture lives under shared packages.
