### Optimization

Tips to optimize smart contract to reduce gas used.

1. Variable packing, declare storage variable in such an order that the storage 
   slot get utilized correctly.
2. Always update the storage variable at the end and use substiture variable 
   for calculations.
3. If possible always use fixed size variables
4. Use correct access specifier when needed ex. external, public, private 
5. A function can have only 16 variables.
6. Libraries of openzapeling does not cost extra cost for deployment, since
   they are already deployed.
7. While using conditionals (|| or &&), make sure to use the most possible 
   condition first to avoid ever execution of second condition. 
8. Error strings in `require` should be of short lengths. Or use solidity `error` keyword
9. 
