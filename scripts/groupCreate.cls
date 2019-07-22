final static integer groupCount = 1000;

list<Group> Groups = new list<Group>();
string nowstamp = string.valueOf(System.now().getTime());

for (integer k = 0; k<groupCount; k++){
  Group g = new Group();
  g.Name = 'Test Group ' + nowstamp + k;
  groups.add(g);
}

insert groups;