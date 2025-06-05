import express from 'express';
import User from '../models/user.js'; // Import the User model

const app = express();
const userRoute = express.Router();

const convert = {
  'a': 'zB',
  'b': 'xy',
  'c': 'mOz',
  'd': 'm',
  'e': '3_l',
  'f': '44d',
  'g': 'Z',
  'h': 's',
  'i': '6f',
  'j': 'tj_d',
  'k': '8',
  'l': '9t',
  'm': 'p',
  'n': '5',
  'o': 'zEr',
  'p': 'ty',
  'q': 'bty',
  'r': '9t8z',
  's': '1s',
  't': '9Tys',
  'u': '44q',
  'v': '0',
  'w': '65',
  'x': 'puT',
  'y': 'lop',
  'z': 't_h',
  '0': 'Ru',
  '1': 'frq',
  '2': '1_put',
  '3': 'b',
  '4': 'Ss',
  '5': 'hjpm',
  '6': 'aa',
  '7': 'sujt',
  '8': '78jq',
  '9': '_hbZ',
  '_': '9hsq',
  'A': 'oqP',
  'B': 'f1',
  'C': 'f2',
  'D': 'f12',
  'E': '5F5',
  'F': '_uhu_',
  'G': 'azer',
  'H': 'KO',
  'I': 'OK',
  'J': 'ByE',
  'K': 'ahha',
  'L': 'jU',
  'M': 'WxW',
  'N': 'ti58',
  'O': 'u_o',
  'P': 'pok',
  'Q': 'gRum',
  'R': '8_f5',
  'S': 'b1en',
  'T': 'Funny',
  'U': 'Bobby',
  'V': 'Arts',
  'W': 'u_i_g7',
  'X': 'oO',
  'Y': '0o',
  'Z': '007'
};

const unconvert = {
  'zB': 'a',
  'xy': 'b',
  'mOz': 'c',
  'm': 'd',
  '3_l': 'e',
  '44d': 'f',
  'Z': 'g',
  's': 'h',
  '6f': 'i',
  'tj_d': 'j',
  '8': 'k',
  '9t': 'l',
  'p': 'm',
  '5': 'n',
  'zEr': 'o',
  'ty': 'p',
  'bty': 'q',
  '9t8z': 'r',
  '1s': 's',
  '9Tys': 't',
  '44q': 'u',
  '0': 'v',
  '65': 'w',
  'puT': 'x',
  'lop': 'y',
  't_h': 'z',
  'Ru': '0',
  'frq': '1',
  '1_put': '2',
  'b': '3',
  'Ss': '4',
  'hjpm': '5',
  'aa': '6',
  'sujt': '7',
  '78jq': '8',
  '_hbZ': '9',
  '9hsq': '_',
  'oqP': 'A',
  'f1': 'B',
  'f2': 'C',
  'f12': 'D',
  '5F5': 'E',
  '_uhu_': 'F',
  'azer': 'G',
  'KO': 'H',
  'OK': 'I',
  'ByE': 'J',
  'ahha': 'K',
  'jU': 'L',
  'WxW': 'M',
  'ti58': 'N',
  'u_o': 'O',
  'pok': 'P',
  'gRum': 'Q',
  '8_f5': 'R',
  'b1en': 'S',
  'Funny': 'T',
  'Bobby': 'U',
  'Arts': 'V',
  'u_i_g7': 'W',
  'oO': 'X',
  '0o': 'Y',
  '007': 'Z'
};

const getSeparator = () => ['-', 'i', 'g', '+', 'w', 'v'][Math.floor(Math.random() * 6)];

const encode = (data) => {
  let encoded = [];
  let dataArray = [...data];
  dataArray.forEach((char) => {
    encoded.push(convert[char], getSeparator());
  });
  return encoded.join('');
}

const decode = (data) => {
  let decoded = [];
  let dataArray = data.split(/-|i|g|\+|w|v/);
  dataArray.forEach((word) => {
    decoded.push(unconvert[word]);
  });
  return decoded.join('');
}

// Get all users
userRoute.route('/').get((req, res, next) => {
  User.find((error, data) => {
      if (error) return next(error);
      else {
        data.forEach((u) => {
          u.login = encode(u.login);
          u.password = encode(u.password);
        })
        res.json(data);
      }
  })
})

// Get one user
userRoute.route('/:login/:password').get((req, res, next) => {
  User.findOne({ login: decode(req.params.login), password: decode(req.params.password) }, (error, data) => {
      if (error) return next(error);
      else {
        if(data !== null){
          data.login = encode(data.login);
          data.password = encode(data.password);
        }
        res.json(data);
      }
  })
})

// Create User
userRoute.route('/').post((req, res, next) => {
  const user = new User(); // use User schema
  // get data to create user from req.body
  user._id = `@${decode(req.body.login)}`;
  user.login = decode(req.body.login);
  user.password = decode(req.body.password);
  user.email = req.body.email;
  user.logo = req.body.logo;
  // save it
  user.save()
    .then(() => {
      user.login = encode(user.login);
      user.password = encode(user.password);
      res.json(user)
    })
    .catch(err => next(err));
});

// Update User
userRoute.route('/:login').put(async (req, res, next) => {
  // get the recipe
  let user = await User.findOne({ login: decode(req.params.login) }).exec();
  // get the new values for user
  let newUser = req.body;
  newUser.login = decode(newUser.login);
  newUser.password = decode(newUser.password);
  // update values
  for (const key in newUser) {
    user[key] = newUser[key];
  }
  // save
  await user.save();
  // send the new value
  user.login = encode(user.login);
  user.password = encode(user.password);
  res.json(user);
})

// Delete User
userRoute.route('/:id').delete((req, res, next) => {
    User.findOneAndRemove({ _id: req.params.id }, (error, data) => {
        if (error) return next(error);
        else res.status(200).json({ msg: data });
    })
})

export default userRoute;